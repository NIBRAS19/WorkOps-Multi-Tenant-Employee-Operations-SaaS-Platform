import type { Request, Response } from "express";
import { login, refresh as refreshService, register } from "../services/auth.service.js";
import { User } from "../models/User.js";
import { Organization } from "../models/Organization.js";
import { Membership } from "../models/Membership.js";
import { Role } from "../models/Role.js";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";
import { audit } from "../services/audit.service.js";

function setRefreshCookie(res: Response, token: string) {
  res.cookie("workops_refresh", token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? "none" : "lax",
    path: "/api/v1/auth",
    maxAge: 7 * 86400000
  });
}

export async function registerController(req: Request, res: Response) {
  const result = await register(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({ success: true, data: { user: result.user, organization: result.organization, accessToken: result.accessToken } });
}

export async function loginController(req: Request, res: Response) {
  const result = await login(req.body.email, req.body.password);
  setRefreshCookie(res, result.refreshToken);
  res.json({ success: true, data: { user: result.user, organization: result.organization, accessToken: result.accessToken } });
}

export async function refreshController(req: Request, res: Response) {
  const token = req.cookies?.workops_refresh ?? req.body.refreshToken;
  if (!token) throw new ApiError(401, "Refresh token missing.", "REFRESH_REQUIRED");
  const result = await refreshService(token);
  res.json({ success: true, data: result });
}

export async function logoutController(_req: Request, res: Response) {
  res.clearCookie("workops_refresh", { httpOnly: true, path: "/api/v1/auth" });
  res.json({ success: true, data: null, message: "Logged out." });
}

export async function meController(req: Request, res: Response) {
  if (!req.auth) throw new ApiError(401, "Authentication required.", "AUTH_REQUIRED");
  const [user, organization, membership, roles] = await Promise.all([
    User.findById(req.auth.userId).select("-passwordHash").lean(),
    Organization.findById(req.auth.organizationId).lean(),
    Membership.findById(req.auth.membershipId).populate("employeeId").lean(),
    Role.find({ organizationId: req.auth.organizationId }).lean()
  ]);
  res.json({ success: true, data: { user, organization, membership, roles } });
}

export async function switchOrganizationController(req: Request, res: Response) {
  if (!req.auth) throw new ApiError(401, "Authentication required.", "AUTH_REQUIRED");
  const membership = await Membership.findOne({ userId: req.auth.userId, organizationId: req.body.organizationId, status: "active" }).lean();
  if (!membership) throw new ApiError(403, "You are not a member of that organization.", "ORG_FORBIDDEN");
  const { signAccessToken, signRefreshToken } = await import("../utils/jwt.js");
  const payload = {
    sub: req.auth.userId,
    org: String(membership.organizationId),
    membership: String(membership._id),
    role: membership.role as any
  };
  setRefreshCookie(res, signRefreshToken(payload));
  res.json({ success: true, data: { accessToken: signAccessToken(payload), organizationId: membership.organizationId } });
}
