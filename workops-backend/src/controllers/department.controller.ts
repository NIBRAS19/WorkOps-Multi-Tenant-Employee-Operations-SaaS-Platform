import type { Request, Response } from "express";
import { Department } from "../models/Department.js";
import { Team } from "../models/Team.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";

export async function list(req: Request, res: Response) {
  const items = await Department.find({ organizationId: req.auth!.organizationId }).populate("headEmployeeId").sort({ name: 1 }).lean();
  res.json({ success: true, data: items });
}
export async function create(req: Request, res: Response) {
  const item = await Department.create({ ...req.body, organizationId: req.auth!.organizationId });
  await audit(req, "created", "Department", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function update(req: Request, res: Response) {
  const item = await Department.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth!.organizationId }, req.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Department not found.", "DEPARTMENT_NOT_FOUND");
  await audit(req, "updated", "Department", String(item._id));
  res.json({ success: true, data: item });
}
export async function remove(req: Request, res: Response) {
  const count = await Employee.countDocuments({ organizationId: req.auth!.organizationId, departmentId: req.params.id });
  if (count) throw new ApiError(409, "Department still has employees.", "DEPARTMENT_NOT_EMPTY");
  const item = await Department.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw new ApiError(404, "Department not found.", "DEPARTMENT_NOT_FOUND");
  res.json({ success: true, data: null });
}
export async function teams(req: Request, res: Response) {
  const filter: any = { organizationId: req.auth!.organizationId };
  if (req.query.departmentId) filter.departmentId = req.query.departmentId;
  const items = await Team.find(filter).populate("departmentId managerId").sort({ name: 1 }).lean();
  res.json({ success: true, data: items });
}
export async function createTeam(req: Request, res: Response) {
  const item = await Team.create({ ...req.body, organizationId: req.auth!.organizationId });
  await audit(req, "created", "Team", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function updateTeam(req: Request, res: Response) {
  const item = await Team.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth!.organizationId }, req.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Team not found.", "TEAM_NOT_FOUND");
  res.json({ success: true, data: item });
}
export async function removeTeam(req: Request, res: Response) {
  const count = await Employee.countDocuments({ organizationId: req.auth!.organizationId, teamId: req.params.id });
  if (count) throw new ApiError(409, "Team still has employees.", "TEAM_NOT_EMPTY");
  const item = await Team.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw new ApiError(404, "Team not found.", "TEAM_NOT_FOUND");
  res.json({ success: true, data: null });
}
