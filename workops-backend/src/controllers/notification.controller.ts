import type { Request, Response } from "express";
import { Notification } from "../models/Notification.js";
import { ApiError } from "../utils/apiError.js";

export async function list(req: Request, res: Response) {
  const data = await Notification.find({ organizationId: req.auth!.organizationId, userId: req.auth!.userId }).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ success: true, data });
}
export async function unreadCount(req: Request, res: Response) {
  const count = await Notification.countDocuments({ organizationId: req.auth!.organizationId, userId: req.auth!.userId, readAt: null });
  res.json({ success: true, data: { count } });
}
export async function read(req: Request, res: Response) {
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.auth!.organizationId, userId: req.auth!.userId },
    { $set: { readAt: new Date() } },
    { new: true }
  );
  if (!item) throw new ApiError(404, "Notification not found.", "NOTIFICATION_NOT_FOUND");
  res.json({ success: true, data: item });
}
export async function readAll(req: Request, res: Response) {
  await Notification.updateMany({ organizationId: req.auth!.organizationId, userId: req.auth!.userId, readAt: null }, { $set: { readAt: new Date() } });
  res.json({ success: true, data: null });
}
