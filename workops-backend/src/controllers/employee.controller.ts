import type { Request, Response } from "express";
import { Employee } from "../models/Employee.js";
import { User } from "../models/User.js";
import { Membership } from "../models/Membership.js";
import { paginate } from "../utils/pagination.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";

export async function list(req: Request, res: Response) {
  const q = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = { organizationId: req.auth!.organizationId };
  if (q.status) filter.status = q.status;
  if (q.departmentId) filter.departmentId = q.departmentId;
  if (q.teamId) filter.teamId = q.teamId;
  if (q.search) filter.$or = [
    { firstName: new RegExp(q.search, "i") },
    { lastName: new RegExp(q.search, "i") },
    { email: new RegExp(q.search, "i") },
    { employeeCode: new RegExp(q.search, "i") }
  ];
  const result = await paginate(Employee, filter, {
    page: Number(q.page ?? 1), limit: Number(q.limit ?? 20), sort: { createdAt: -1 },
    populate: ["departmentId", "teamId", "managerId"]
  });
  res.json({ success: true, data: result });
}

export async function get(req: Request, res: Response) {
  const employee = await Employee.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId })
    .populate("departmentId teamId managerId").lean();
  if (!employee) throw new ApiError(404, "Employee not found.", "EMPLOYEE_NOT_FOUND");
  res.json({ success: true, data: employee });
}

export async function create(req: Request, res: Response) {
  const count = await Employee.countDocuments({ organizationId: req.auth!.organizationId });
  const employeeCode = `EMP-${String(count + 1).padStart(4, "0")}`;
  const employee = await Employee.create({ ...req.body, organizationId: req.auth!.organizationId, employeeCode });
  await audit(req, "created", "Employee", String(employee._id), { employeeCode });
  res.status(201).json({ success: true, data: employee });
}

export async function update(req: Request, res: Response) {
  const employee = await Employee.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.auth!.organizationId },
    { $set: req.body },
    { new: true, runValidators: true }
  ).lean();
  if (!employee) throw new ApiError(404, "Employee not found.", "EMPLOYEE_NOT_FOUND");
  await audit(req, "updated", "Employee", String(employee._id), { fields: Object.keys(req.body) });
  res.json({ success: true, data: employee });
}

export async function remove(req: Request, res: Response) {
  const employee = await Employee.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.auth!.organizationId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  if (!employee) throw new ApiError(404, "Employee not found.", "EMPLOYEE_NOT_FOUND");
  await audit(req, "deactivated", "Employee", String(employee._id));
  res.json({ success: true, data: null });
}

export async function createUserAccount(req: Request, res: Response) {
  const employee = await Employee.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!employee) throw new ApiError(404, "Employee not found.", "EMPLOYEE_NOT_FOUND");
  const existing = await User.findOne({ email: employee.email });
  if (existing) throw new ApiError(409, "A user already exists for this email.", "USER_EXISTS");
  const password = req.body.password ?? `ChangeMe-${Math.random().toString(36).slice(2, 10)}`;
  const bcrypt = await import("bcryptjs");
  const user = await User.create({
    email: employee.email,
    passwordHash: await bcrypt.hash(password, 12),
    firstName: employee.firstName,
    lastName: employee.lastName,
    status: "active",
    emailVerified: false
  });
  const membership = await Membership.create({
    organizationId: req.auth!.organizationId,
    userId: user._id,
    role: "employee",
    status: "active",
    employeeId: employee._id,
    joinedAt: new Date()
  });
  employee.userId = user._id;
  await employee.save();
  await audit(req, "created_user_account", "Employee", String(employee._id));
  res.status(201).json({ success: true, data: { userId: user._id, membershipId: membership._id, temporaryPassword: password } });
}
