import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
import { roleNames, permissionKeys } from "../utils/permissions.js";

const roleSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  name: { type: String, required: true },
  key: { type: String, enum: roleNames, required: true },
  permissions: { type: [String], enum: permissionKeys, default: [] },
  isSystem: { type: Boolean, default: false }
}, { timestamps: true });

roleSchema.index({ organizationId: 1, key: 1 }, { unique: true });
export type RoleDocument = InferSchemaType<typeof roleSchema>;
export const Role = model("Role", roleSchema);
