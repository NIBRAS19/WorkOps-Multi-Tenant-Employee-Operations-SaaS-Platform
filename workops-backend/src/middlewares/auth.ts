import type { RequestHandler } from "express";
import { User } from "../models/User.js";
import { Membership } from "../models/Membership.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/apiError.js";
import type { RoleName } from "../utils/permissions.js";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required.", "AUTH_REQUIRED");
    }

    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user || user.status !== "active") {
      throw new ApiError(401, "User account is inactive or missing.", "AUTH_INVALID");
    }

    const headerOrg = req.header("X-Organization-Id");
    const organizationId = headerOrg ?? payload.org;
    const membership = await Membership.findOne({
      userId: user._id,
      organizationId,
      status: "active"
    }).lean();

    if (!membership) {
      throw new ApiError(403, "You are not a member of this organization.", "ORG_FORBIDDEN");
    }

    req.auth = {
      userId: String(user._id),
      organizationId: String(membership.organizationId),
      membershipId: String(membership._id),
      role: membership.role as RoleName
    };

    next();
  } catch (error) {
    next(error);
  }
};
