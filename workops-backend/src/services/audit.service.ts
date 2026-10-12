import type { Request } from "express";
import { AuditLog } from "../models/AuditLog.js";

export async function audit(
  req: Request,
  action: string,
  resourceType: string,
  resourceId?: string,
  metadata?: unknown
): Promise<void> {
  if (!req.auth) return;
  await AuditLog.create({
    organizationId: req.auth.organizationId,
    actorId: req.auth.userId,
    action,
    resourceType,
    resourceId,
    metadata,
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  });
}
