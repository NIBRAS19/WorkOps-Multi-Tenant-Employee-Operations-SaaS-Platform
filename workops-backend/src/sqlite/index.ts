import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "../config/env.js";

let databaseInstance: DatabaseSync | null = null;
let isOpen = false;

export function generateId(): string {
  return crypto.randomBytes(12).toString("hex");
}

export const modelTableMap: Record<string, string> = {
  Organization: "organizations",
  User: "users",
  Membership: "memberships",
  Role: "roles",
  Department: "departments",
  Team: "teams",
  Employee: "employees",
  LeavePolicy: "leave_policies",
  LeaveRequest: "leave_requests",
  Attendance: "attendance",
  Task: "tasks",
  ServiceRequest: "service_requests",
  Document: "documents",
  DocumentVersion: "document_versions",
  Asset: "assets",
  Announcement: "announcements",
  Notification: "notifications",
  CalendarEvent: "calendar_events",
  AuditLog: "audit_logs",
  Invite: "invites"
};

export const fieldRefMap: Record<string, string> = {
  departmentId: "Department",
  teamId: "Team",
  managerId: "Employee",
  employeeId: "Employee",
  headEmployeeId: "Employee",
  userId: "User",
  actorUserId: "User",
  createdBy: "User",
  uploadedBy: "User",
  organizationId: "Organization",
  leavePolicyId: "LeavePolicy",
  approverId: "Employee",
  assigneeId: "Employee",
  reporterId: "Employee",
  requesterId: "Employee",
  currentVersionId: "DocumentVersion",
  roleId: "Role"
};

export function getDatabase(): DatabaseSync {
  if (!databaseInstance) {
    const dbPath = path.resolve(env.sqlitePath);
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    databaseInstance = new DatabaseSync(dbPath);
    databaseInstance.exec("PRAGMA journal_mode = WAL;");
    databaseInstance.exec("PRAGMA foreign_keys = ON;");
    databaseInstance.exec("PRAGMA busy_timeout = 5000;");
    isOpen = true;
    initTables(databaseInstance);
  }
  return databaseInstance;
}

function initTables(db: DatabaseSync): void {
  for (const tableName of Object.values(modelTableMap)) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id TEXT PRIMARY KEY,
        organization_id TEXT,
        created_at TEXT,
        updated_at TEXT,
        data TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_${tableName}_org ON ${tableName}(organization_id);
      CREATE INDEX IF NOT EXISTS idx_${tableName}_created ON ${tableName}(created_at);
    `);
  }

  // Specialized indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(json_extract(data, '$.email'));
    CREATE INDEX IF NOT EXISTS idx_orgs_slug ON organizations(json_extract(data, '$.slug'));
  `);
}

export function closeDatabase(): void {
  if (databaseInstance) {
    databaseInstance.close();
    databaseInstance = null;
    isOpen = false;
  }
}

function getProp(obj: any, pathStr: string): any {
  if (!obj) return undefined;
  if (!pathStr.includes(".")) return obj[pathStr];
  const parts = pathStr.split(".");
  let curr = obj;
  for (const part of parts) {
    if (curr == null) return undefined;
    curr = curr[part];
  }
  return curr;
}

function setProp(obj: any, pathStr: string, value: any): void {
  const parts = pathStr.split(".");
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]!;
    if (curr[p] == null || typeof curr[p] !== "object") {
      curr[p] = {};
    }
    curr = curr[p];
  }
  curr[parts[parts.length - 1]!] = value;
}

function matchValue(actual: any, expected: any): boolean {
  if (expected === undefined) return true;
  if (expected === null) return actual === null || actual === undefined;

  if (expected instanceof RegExp) {
    return expected.test(String(actual ?? ""));
  }

  if (expected instanceof Date) {
    const actDate = actual instanceof Date ? actual : new Date(actual);
    return !isNaN(actDate.getTime()) && actDate.getTime() === expected.getTime();
  }

  if (typeof expected === "object" && expected !== null && !Array.isArray(expected)) {
    for (const op of Object.keys(expected)) {
      const val = expected[op];
      if (op === "$ne") {
        if (actual === val) return false;
      } else if (op === "$in") {
        if (!Array.isArray(val)) return false;
        const matched = val.some((item) => matchValue(actual, item));
        if (!matched) return false;
      } else if (op === "$nin") {
        if (Array.isArray(val) && val.some((item) => matchValue(actual, item))) return false;
      } else if (op === "$gte") {
        const aVal = actual instanceof Date ? actual.getTime() : typeof actual === "string" && !isNaN(Date.parse(actual)) ? new Date(actual).getTime() : actual;
        const eVal = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? new Date(val).getTime() : val;
        if (!(aVal >= eVal)) return false;
      } else if (op === "$lte") {
        const aVal = actual instanceof Date ? actual.getTime() : typeof actual === "string" && !isNaN(Date.parse(actual)) ? new Date(actual).getTime() : actual;
        const eVal = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? new Date(val).getTime() : val;
        if (!(aVal <= eVal)) return false;
      } else if (op === "$gt") {
        const aVal = actual instanceof Date ? actual.getTime() : typeof actual === "string" && !isNaN(Date.parse(actual)) ? new Date(actual).getTime() : actual;
        const eVal = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? new Date(val).getTime() : val;
        if (!(aVal > eVal)) return false;
      } else if (op === "$lt") {
        const aVal = actual instanceof Date ? actual.getTime() : typeof actual === "string" && !isNaN(Date.parse(actual)) ? new Date(actual).getTime() : actual;
        const eVal = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? new Date(val).getTime() : val;
        if (!(aVal < eVal)) return false;
      }
    }
    return true;
  }

  return String(actual ?? "") === String(expected ?? "");
}

function matchDoc(doc: any, filter?: Record<string, any>): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, val] of Object.entries(filter)) {
    if (key === "$or" && Array.isArray(val)) {
      if (!val.some((sub) => matchDoc(doc, sub))) return false;
      continue;
    }
    if (key === "$and" && Array.isArray(val)) {
      if (!val.every((sub) => matchDoc(doc, sub))) return false;
      continue;
    }

    const actual = key === "id" ? doc._id : key === "_id" ? doc._id : getProp(doc, key);
    if (!matchValue(actual, val)) return false;
  }

  return true;
}

export class DocumentInstance {
  [key: string]: any;

  constructor(data: any, private _model: Model<any>) {
    Object.assign(this, data);
    if (this._id && !this.id) this.id = this._id;
  }

  async save(): Promise<this> {
    const dataToSave = { ...this };
    delete (dataToSave as any)._model;
    await this._model._saveInstance(dataToSave);
    return this;
  }

  toObject(): any {
    const obj: any = {};
    for (const key of Object.keys(this)) {
      if (key !== "_model") obj[key] = this[key];
    }
    return obj;
  }

  toJSON(): any {
    return this.toObject();
  }
}

export class Query<T> implements PromiseLike<T> {
  private _sort?: Record<string, 1 | -1>;
  private _skip?: number;
  private _limit?: number;
  private _select?: string;
  private _populate: string[] = [];
  private _lean = false;
  private _isSingle = false;

  constructor(
    private _model: Model<any>,
    private _filter: Record<string, any> = {},
    isSingle = false
  ) {
    this._isSingle = isSingle;
  }

  sort(sortObj: Record<string, 1 | -1>): this {
    this._sort = sortObj;
    return this;
  }

  skip(n: number): this {
    this._skip = n;
    return this;
  }

  limit(n: number): this {
    this._limit = n;
    return this;
  }

  select(fields: string): this {
    this._select = fields;
    return this;
  }

  populate(paths: string | string[]): this {
    if (typeof paths === "string") {
      this._populate.push(...paths.trim().split(/\s+/).filter(Boolean));
    } else if (Array.isArray(paths)) {
      this._populate.push(...paths);
    }
    return this;
  }

  lean(): this {
    this._lean = true;
    return this;
  }

  async distinct(field: string): Promise<any[]> {
    const items = (await this.exec()) as any[];
    const set = new Set();
    for (const it of Array.isArray(items) ? items : [items]) {
      const val = getProp(it, field);
      if (val !== undefined && val !== null) set.add(val);
    }
    return Array.from(set);
  }

  async exec(): Promise<T> {
    const db = getDatabase();
    const tableName = this._model.tableName;

    let rows: any[];
    if (this._filter._id) {
      const row = db.prepare(`SELECT data FROM ${tableName} WHERE id = ?`).get(String(this._filter._id)) as any;
      rows = row ? [JSON.parse(row.data)] : [];
    } else if (this._filter.organizationId) {
      const dbRows = db.prepare(`SELECT data FROM ${tableName} WHERE organization_id = ?`).all(String(this._filter.organizationId)) as any[];
      rows = dbRows.map((r) => JSON.parse(r.data));
    } else {
      const dbRows = db.prepare(`SELECT data FROM ${tableName}`).all() as any[];
      rows = dbRows.map((r) => JSON.parse(r.data));
    }

    let items = rows.filter((doc) => matchDoc(doc, this._filter));

    if (this._sort) {
      const [sortKey, sortDir] = Object.entries(this._sort)[0] ?? ["createdAt", -1];
      items.sort((a, b) => {
        const valA = getProp(a, sortKey!);
        const valB = getProp(b, sortKey!);
        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        if (valA < valB) return sortDir === 1 ? -1 : 1;
        if (valA > valB) return sortDir === 1 ? 1 : -1;
        return 0;
      });
    }

    if (this._skip) {
      items = items.slice(this._skip);
    }
    if (this._limit) {
      items = items.slice(0, this._limit);
    }

    // Populate references
    if (this._populate.length > 0) {
      for (const item of items) {
        for (const popPath of this._populate) {
          const targetModelName = fieldRefMap[popPath];
          if (!targetModelName) continue;
          const targetModel = modelsRegistry[targetModelName];
          if (!targetModel) continue;

          const refVal = item[popPath];
          if (refVal && typeof refVal === "string") {
            const populated = await targetModel.findById(refVal).lean();
            if (populated) item[popPath] = populated;
          }
        }
      }
    }

    // Selection projection
    if (this._select) {
      const selectFields = this._select.split(/\s+/).filter(Boolean);
      const isExclude = selectFields.every((f) => f.startsWith("-"));
      if (isExclude) {
        const excluded = selectFields.map((f) => f.replace(/^-/, ""));
        for (const item of items) {
          for (const f of excluded) delete (item as any)[f];
        }
      }
    }

    if (this._isSingle) {
      const single = items[0] ?? null;
      if (!single) return null as T;
      return (this._lean ? single : new DocumentInstance(single, this._model)) as T;
    }

    return (this._lean ? items : items.map((doc) => new DocumentInstance(doc, this._model))) as T;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }
}

export class ModifyQuery<T> implements PromiseLike<T> {
  private _lean = false;
  private _populate: string[] = [];

  constructor(
    private _model: Model<any>,
    private _executor: (options: { lean: boolean; populate: string[] }) => Promise<any>
  ) {}

  lean(): this {
    this._lean = true;
    return this;
  }

  populate(paths: string | string[]): this {
    if (typeof paths === "string") {
      this._populate.push(...paths.trim().split(/\s+/).filter(Boolean));
    } else if (Array.isArray(paths)) {
      this._populate.push(...paths);
    }
    return this;
  }

  async exec(): Promise<T> {
    return this._executor({ lean: this._lean, populate: this._populate });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }
}

export class Model<T = any> {
  constructor(public modelName: string, public schema: any) {}

  get tableName(): string {
    return modelTableMap[this.modelName] ?? this.modelName.toLowerCase();
  }

  async _saveInstance(doc: any): Promise<void> {
    const db = getDatabase();
    const id = String(doc._id);
    const orgId = doc.organizationId ? String(doc.organizationId) : null;
    const now = new Date().toISOString();
    doc.updatedAt = now;
    if (!doc.createdAt) doc.createdAt = now;

    db.prepare(`
      INSERT INTO ${this.tableName} (id, organization_id, created_at, updated_at, data)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        organization_id = excluded.organization_id,
        updated_at = excluded.updated_at,
        data = excluded.data;
    `).run(id, orgId, doc.createdAt, doc.updatedAt, JSON.stringify(doc));
  }

  async create(docOrDocs: any, _options?: { session?: any }): Promise<any> {
    const isArray = Array.isArray(docOrDocs);
    const docs = isArray ? docOrDocs : [docOrDocs];
    const createdList: any[] = [];

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO ${this.tableName} (id, organization_id, created_at, updated_at, data)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        organization_id = excluded.organization_id,
        updated_at = excluded.updated_at,
        data = excluded.data;
    `);

    for (const d of docs) {
      const item = { ...d };
      if (this.schema && this.schema.definition) {
        for (const [key, fieldDef] of Object.entries(this.schema.definition)) {
          if (item[key] === undefined && fieldDef && typeof fieldDef === "object" && "default" in fieldDef) {
            const defVal = (fieldDef as any).default;
            item[key] = typeof defVal === "function" ? defVal() : defVal;
          }
        }
      }
      if (!item._id) item._id = generateId();
      const now = new Date().toISOString();
      item.createdAt = item.createdAt ? new Date(item.createdAt).toISOString() : now;
      item.updatedAt = now;
      const orgId = item.organizationId ? String(item.organizationId) : null;
      stmt.run(String(item._id), orgId, item.createdAt, item.updatedAt, JSON.stringify(item));
      createdList.push(new DocumentInstance(item, this));
    }

    return isArray ? createdList : createdList[0];
  }

  async insertMany(docs: any[]): Promise<any[]> {
    return this.create(docs);
  }

  find(filter: Record<string, any> = {}): Query<T[]> {
    return new Query<T[]>(this, filter, false);
  }

  findOne(filter: Record<string, any> = {}): Query<T | null> {
    return new Query<T | null>(this, filter, true);
  }

  findById(id: any): Query<T | null> {
    return new Query<T | null>(this, { _id: id }, true);
  }

  findOneAndUpdate(
    filter: Record<string, any>,
    update: Record<string, any>,
    options: { new?: boolean; upsert?: boolean; runValidators?: boolean } = {}
  ): ModifyQuery<any> {
    return new ModifyQuery<any>(this, async ({ lean, populate }) => {
      const existing = await this.findOne(filter).lean();
      if (!existing) {
        if (options.upsert) {
          const toCreate: any = { ...filter };
          if (update.$setOnInsert) Object.assign(toCreate, update.$setOnInsert);
          if (update.$set) Object.assign(toCreate, update.$set);
          const created = await this.create(toCreate);
          return lean ? (created ? created.toObject() : null) : created;
        }
        return null;
      }

      const updated = { ...existing };
      if (update.$setOnInsert && !existing) {
        Object.assign(updated, update.$setOnInsert);
      }
      if (update.$set) {
        for (const [k, v] of Object.entries(update.$set)) {
          setProp(updated, k, v);
        }
      }
      if (update.$push) {
        for (const [k, v] of Object.entries(update.$push)) {
          if (!Array.isArray((updated as any)[k])) (updated as any)[k] = [];
          (updated as any)[k].push(v);
        }
      }

      for (const [k, v] of Object.entries(update)) {
        if (!k.startsWith("$")) {
          setProp(updated, k, v);
        }
      }

      await this._saveInstance(updated);

      if (populate.length > 0) {
        for (const popPath of populate) {
          const targetModelName = fieldRefMap[popPath];
          if (!targetModelName) continue;
          const targetModel = modelsRegistry[targetModelName];
          if (!targetModel) continue;

          const refVal = (updated as any)[popPath];
          if (refVal && typeof refVal === "string") {
            const popDoc = await targetModel.findById(refVal).lean();
            if (popDoc) (updated as any)[popPath] = popDoc;
          }
        }
      }

      return lean ? updated : new DocumentInstance(updated, this);
    });
  }

  findByIdAndUpdate(
    id: any,
    update: Record<string, any>,
    options: { new?: boolean; upsert?: boolean; runValidators?: boolean } = {}
  ): ModifyQuery<any> {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async updateOne(
    filter: Record<string, any>,
    update: Record<string, any>,
    options: { upsert?: boolean } = {}
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const res = await this.findOneAndUpdate(filter, update, options);
    return { acknowledged: true, modifiedCount: res ? 1 : 0 };
  }

  async updateMany(
    filter: Record<string, any>,
    update: Record<string, any>
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const docs = (await this.find(filter).lean()) as any[];
    for (const d of docs) {
      await this.findOneAndUpdate({ _id: d._id }, update);
    }
    return { acknowledged: true, modifiedCount: docs.length };
  }

  async findOneAndDelete(filter: Record<string, any>): Promise<any> {
    const doc = (await this.findOne(filter).lean()) as any;
    if (!doc) return null;
    const db = getDatabase();
    db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`).run(String(doc._id));
    return doc;
  }

  async findByIdAndDelete(id: any): Promise<any> {
    return this.findOneAndDelete({ _id: id });
  }

  async deleteMany(filter: Record<string, any>): Promise<{ deletedCount: number }> {
    const docs = (await this.find(filter).lean()) as any[];
    const db = getDatabase();
    const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    for (const d of docs) {
      stmt.run(String(d._id));
    }
    return { deletedCount: docs.length };
  }

  async countDocuments(filter: Record<string, any> = {}): Promise<number> {
    const docs = await this.find(filter).lean();
    return docs.length;
  }

  async distinct(field: string, filter: Record<string, any> = {}): Promise<any[]> {
    return this.find(filter).distinct(field);
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    let docs = await this.find({}).lean();

    for (const stage of pipeline) {
      if (stage.$match) {
        docs = docs.filter((d) => matchDoc(d, stage.$match));
      } else if (stage.$group) {
        const groupConfig = stage.$group;
        const groups = new Map<string, any>();

        for (const doc of docs) {
          let groupKey: any;
          if (typeof groupConfig._id === "string" && groupConfig._id.startsWith("$")) {
            const field = groupConfig._id.slice(1);
            groupKey = getProp(doc, field);
          } else if (typeof groupConfig._id === "object" && groupConfig._id !== null) {
            const sub: Record<string, any> = {};
            for (const [k, v] of Object.entries(groupConfig._id)) {
              if (typeof v === "object" && (v as any)?.$dateToString) {
                const dateField = (v as any).$dateToString.date.slice(1);
                const rawDate = getProp(doc, dateField);
                sub[k] = rawDate ? new Date(rawDate).toISOString().slice(0, 10) : "";
              } else if (typeof v === "string" && v.startsWith("$")) {
                sub[k] = getProp(doc, v.slice(1));
              } else {
                sub[k] = v;
              }
            }
            groupKey = JSON.stringify(sub);
          } else {
            groupKey = groupConfig._id;
          }

          const serializedKey = typeof groupKey === "object" ? JSON.stringify(groupKey) : String(groupKey ?? "");
          if (!groups.has(serializedKey)) {
            const initial: any = { _id: typeof groupKey === "string" && groupKey.startsWith("{") ? JSON.parse(groupKey) : groupKey };
            for (const [accKey] of Object.entries(groupConfig)) {
              if (accKey === "_id") continue;
              initial[accKey] = 0;
            }
            groups.set(serializedKey, initial);
          }

          const groupObj = groups.get(serializedKey)!;
          for (const [accKey, accVal] of Object.entries(groupConfig)) {
            if (accKey === "_id") continue;
            if (typeof accVal === "object" && accVal !== null && (accVal as any).$sum) {
              const sumExpr = (accVal as any).$sum;
              if (sumExpr === 1) {
                groupObj[accKey] += 1;
              } else if (typeof sumExpr === "string" && sumExpr.startsWith("$")) {
                const numVal = Number(getProp(doc, sumExpr.slice(1)) ?? 0);
                groupObj[accKey] += isNaN(numVal) ? 0 : numVal;
              }
            }
          }
        }
        docs = Array.from(groups.values());
      } else if (stage.$sort) {
        const [sortKey, sortDir] = Object.entries(stage.$sort)[0] ?? ["_id", 1];
        docs.sort((a, b) => {
          const valA = getProp(a, sortKey!);
          const valB = getProp(b, sortKey!);
          if (valA == null && valB == null) return 0;
          if (valA == null) return 1;
          if (valB == null) return -1;
          if (valA < valB) return sortDir === 1 ? -1 : 1;
          if (valA > valB) return sortDir === 1 ? 1 : -1;
          return 0;
        });
      }
    }

    return docs;
  }
}

export const modelsRegistry: Record<string, Model<any>> = {};

export function model<T = any>(name: string, schema: any): Model<T> {
  if (!modelsRegistry[name]) {
    modelsRegistry[name] = new Model<T>(name, schema);
  }
  return modelsRegistry[name];
}

export class Schema {
  static Types = {
    ObjectId: class ObjectId {},
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    Mixed: Object
  };

  constructor(public definition: any, public options: any = {}) {}

  index(_fields: any, _options?: any): void {}
}

export type InferSchemaType<T> = any;

export async function connectDatabase(): Promise<void> {
  getDatabase();
  console.log(`SQLite database connected: ${env.sqlitePath}`);
}

export const mongoose = {
  connect: async () => connectDatabase(),
  connection: {
    get readyState() { return isOpen ? 1 : 0; },
    host: "localhost",
    name: "workops.db",
    close: async () => closeDatabase()
  },
  startSession: async () => ({
    withTransaction: async (fn: () => Promise<void>) => {
      const db = getDatabase();
      db.exec("BEGIN IMMEDIATE;");
      try {
        await fn();
        db.exec("COMMIT;");
      } catch (err) {
        db.exec("ROLLBACK;");
        throw err;
      }
    },
    endSession: () => {}
  }),
  Error: {
    ValidationError: class ValidationError extends Error {},
    CastError: class CastError extends Error {}
  },
  Types: {
    ObjectId: Object.assign(
      function ObjectId(id?: string) { return id ?? generateId(); },
      { isValid: (id: string) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id) }
    )
  }
};
