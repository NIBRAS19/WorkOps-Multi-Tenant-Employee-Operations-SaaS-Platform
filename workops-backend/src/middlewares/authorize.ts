import type { RequestHandler } from "express";
import { hasPermission, type PermissionKey } from "../utils/permissions.js";
import { ApiError } from "../utils/apiError.js";

export function requirePermission(permission: PermissionKey): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) return next(new ApiError(401, "Authentication required.", "AUTH_REQUIRED"));
    if (!hasPermission(req.auth.role, permission)) {
      return next(new ApiError(403, "You do not have permission for this action.", "FORBIDDEN"));
    }
    next();
  };
}
