import type { Request, Response } from "express";
import { AuditLog } from "../models/AuditLog.js";
export async function list(req: Request, res: Response) {
  const filter: any = { organizationId: req.auth!.organizationId };
  if (req.query.action) filter.action = req.query.action;
  if (req.query.resourceType) filter.resourceType = req.query.resourceType;
  const items = await AuditLog.find(filter).populate("actorId").sort({ createdAt: -1 }).limit(Number(req.query.limit ?? 100)).lean();
  res.json({ success: true, data: items });
}
