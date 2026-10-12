import type { Request, Response } from "express";
import { CalendarEvent } from "../models/CalendarEvent.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";

export async function list(req: Request, res: Response) {
  const from = req.query.from ? new Date(String(req.query.from)) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = req.query.to ? new Date(String(req.query.to)) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);
  const items = await CalendarEvent.find({ organizationId: req.auth!.organizationId, startAt: { $lt: to }, endAt: { $gt: from } }).sort({ startAt: 1 }).lean();
  res.json({ success: true, data: items });
}
export async function create(req: Request, res: Response) {
  const item = await CalendarEvent.create({ ...req.body, organizationId: req.auth!.organizationId, createdBy: req.auth!.userId });
  await audit(req, "created", "CalendarEvent", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function update(req: Request, res: Response) {
  const item = await CalendarEvent.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth!.organizationId }, req.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Calendar event not found.", "EVENT_NOT_FOUND");
  res.json({ success: true, data: item });
}
export async function remove(req: Request, res: Response) {
  const item = await CalendarEvent.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw new ApiError(404, "Calendar event not found.", "EVENT_NOT_FOUND");
  res.json({ success: true, data: null });
}
