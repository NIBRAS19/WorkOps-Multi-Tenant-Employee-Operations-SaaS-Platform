import type { Request, Response } from "express";
import { Announcement } from "../models/Announcement.js";
import { Employee } from "../models/Employee.js";
import { User } from "../models/User.js";
import { createNotification } from "../services/notification.service.js";
import { audit } from "../services/audit.service.js";
import { ApiError } from "../utils/apiError.js";

export async function list(req: Request, res: Response) {
  const items = await Announcement.find({ organizationId: req.auth!.organizationId }).sort({ publishAt: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function create(req: Request, res: Response) {
  const item = await Announcement.create({ ...req.body, organizationId: req.auth!.organizationId, createdBy: req.auth!.userId });
  const users = await User.find({ _id: { $in: await Employee.find({ organizationId: req.auth!.organizationId, status: "active" }).distinct("userId") } }).select("_id").lean();
  await Promise.all(users.map((u) => createNotification({
    organizationId: req.auth!.organizationId, userId: String(u._id), type: "announcement",
    title: req.body.title, body: req.body.message.slice(0, 160), data: { announcementId: String(item._id) }
  })));
  await audit(req, "published", "Announcement", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function remove(req: Request, res: Response) {
  const item = await Announcement.findOneAndDelete({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw new ApiError(404, "Announcement not found.", "ANNOUNCEMENT_NOT_FOUND");
  res.json({ success: true, data: null });
}
