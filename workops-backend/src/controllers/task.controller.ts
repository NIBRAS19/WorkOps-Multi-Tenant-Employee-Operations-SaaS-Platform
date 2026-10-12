import type { Request, Response } from "express";
import { Task } from "../models/Task.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";

async function actorEmployee(req: Request) {
  return Employee.findOne({ organizationId: req.auth!.organizationId, userId: req.auth!.userId });
}
export async function list(req: Request, res: Response) {
  const filter: any = { organizationId: req.auth!.organizationId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.assigneeId) filter.assigneeId = req.query.assigneeId;
  const items = await Task.find(filter).populate("assigneeId reporterId").sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function create(req: Request, res: Response) {
  const actor = await actorEmployee(req);
  const item = await Task.create({
    ...req.body,
    organizationId: req.auth!.organizationId,
    reporterId: actor?._id
  });
  await audit(req, "created", "Task", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function get(req: Request, res: Response) {
  const item = await Task.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId }).populate("assigneeId reporterId").lean();
  if (!item) throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  res.json({ success: true, data: item });
}
export async function update(req: Request, res: Response) {
  const item = await Task.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth!.organizationId }, { $set: req.body }, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  await audit(req, "updated", "Task", String(item._id), { fields: Object.keys(req.body) });
  res.json({ success: true, data: item });
}
export async function remove(req: Request, res: Response) {
  const item = await Task.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw new ApiError(404, "Task not found.", "TASK_NOT_FOUND");
  res.json({ success: true, data: null });
}
