import type { Request, Response } from "express";
import { Organization } from "../models/Organization.js";
import { Membership } from "../models/Membership.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";
import { createInvite } from "../services/invite.service.js";

export async function getOrganization(req: Request, res: Response) {
  const org = await Organization.findById(req.auth!.organizationId).lean();
  res.json({ success: true, data: org });
}
export async function updateOrganization(req: Request, res: Response) {
  const update: any = {};
  for (const key of ["name","logoUrl","industry","country","timezone"]) if (req.body[key] !== undefined) update[key] = req.body[key];
  for (const key of ["workWeek","workdayStart","workdayEnd","attendanceGraceMinutes"]) if (req.body[key] !== undefined) update[`settings.${key}`] = req.body[key];
  const org = await Organization.findByIdAndUpdate(req.auth!.organizationId, { $set: update }, { new: true, runValidators: true }).lean();
  await audit(req, "updated", "Organization", req.auth!.organizationId, { fields: Object.keys(update) });
  res.json({ success: true, data: org });
}
export async function members(req: Request, res: Response) {
  const memberships = await Membership.find({ organizationId: req.auth!.organizationId }).populate("userId employeeId roleId").sort({ createdAt: 1 }).lean();
  res.json({ success: true, data: memberships });
}
export async function changeRole(req: Request, res: Response) {
  const membership = await Membership.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!membership) throw new ApiError(404, "Membership not found.", "MEMBERSHIP_NOT_FOUND");
  if (membership.role === "owner") throw new ApiError(400, "The owner role cannot be changed here.", "OWNER_ROLE_PROTECTED");
  const role = req.body.role as "admin" | "manager" | "employee";
  membership.role = role;
  const roleDoc = await Role.findOne({ organizationId: req.auth!.organizationId, key: role });
  membership.roleId = (roleDoc?._id ?? null) as any;
  await membership.save();
  await audit(req, "role_changed", "Membership", String(membership._id), { role });
  res.json({ success: true, data: membership });
}
export async function invite(req: Request, res: Response) {
  const result = await createInvite({
    organizationId: req.auth!.organizationId,
    invitedBy: req.auth!.userId,
    email: req.body.email,
    role: req.body.role ?? "employee"
  });
  // Development-friendly response; production should deliver via email/SMS.
  res.status(201).json({
    success: true,
    data: {
      inviteId: result.invite._id,
      expiresAt: result.invite.expiresAt,
      inviteToken: result.token
    },
    message: "Invite created. Deliver the token via your configured notification channel."
  });
}
