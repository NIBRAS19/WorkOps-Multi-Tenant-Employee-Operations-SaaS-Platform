import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Organization } from "../models/Organization.js";
import { Membership } from "../models/Membership.js";
import { Role } from "../models/Role.js";
import { Invite } from "../models/Invite.js";
import { rolePermissions, type RoleName } from "../utils/permissions.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/apiError.js";
import { hashToken } from "../utils/crypto.js";
import { mongoose } from "../sqlite/index.js";

function slugify(value: string): string {
  const base = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "workspace"}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function register(input: {
  firstName: string; lastName: string; email: string; password: string; companyName: string;
}) {
  const email = input.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with that email already exists.", "EMAIL_EXISTS");

  const session = await mongoose.startSession();
  let output: any;
  try {
    await session.withTransaction(async () => {
      const passwordHash = await bcrypt.hash(input.password, 12);
      const [organization] = await Organization.create([{
        name: input.companyName,
        slug: slugify(input.companyName),
        country: "AE",
        timezone: "Asia/Dubai",
        subscription: { plan: "starter", status: "trialing", trialEndsAt: new Date(Date.now() + 14 * 86400000) }
      }], { session });

      const [user] = await User.create([{
        email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName
      }], { session });

      if (!organization || !user) throw new Error("Failed to initialize user or organization");

      const [role] = await Role.create([{
        organizationId: organization._id,
        name: "Owner",
        key: "owner",
        permissions: rolePermissions.owner,
        isSystem: true
      }], { session });

      for (const key of ["admin","manager","employee"] as const) {
        await Role.create([{
          organizationId: organization._id,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          key,
          permissions: rolePermissions[key],
          isSystem: true
        }], { session });
      }

      if (!role) throw new Error("Failed to create owner role");

      const [membership] = await Membership.create([{
        organizationId: organization._id,
        userId: user._id,
        role: "owner",
        roleId: role._id,
        status: "active",
        joinedAt: new Date()
      }], { session });

      if (!membership) throw new Error("Failed to create membership");

      const payload = {
        sub: String(user._id),
        org: String(organization._id),
        membership: String(membership._id),
        role: "owner" as RoleName
      };

      output = {
        user: user.toObject(),
        organization: organization.toObject(),
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload)
      };
    });
  } finally {
    await session.endSession();
  }
  if (!output) throw new Error("Registration failed.");
  return output;
}

export async function login(emailRaw: string, password: string) {
  const user = await User.findOne({ email: emailRaw.toLowerCase() });
  if (!user) throw new ApiError(401, "Invalid email or password.", "AUTH_INVALID");
  if (user.status !== "active") throw new ApiError(403, "Your account is not active.", "ACCOUNT_INACTIVE");
  if (!(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password.", "AUTH_INVALID");
  }

  const membership = await Membership.findOne({ userId: user._id, status: "active" }).sort({ createdAt: 1 });
  if (!membership) throw new ApiError(403, "No active organization membership exists.", "NO_ORG");

  user.lastLoginAt = new Date();
  await user.save();

  const payload = {
    sub: String(user._id),
    org: String(membership.organizationId),
    membership: String(membership._id),
    role: membership.role as RoleName
  };

  return {
    user: user.toObject(),
    organization: await Organization.findById(membership.organizationId).lean(),
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
}

export async function refresh(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const membership = await Membership.findById(payload.membership).lean();
    if (!membership || membership.status !== "active" || String(membership.userId) !== payload.sub) {
      throw new ApiError(401, "Refresh session is no longer valid.", "REFRESH_INVALID");
    }
    return {
      accessToken: signAccessToken({
        sub: payload.sub,
        org: String(membership.organizationId),
        membership: String(membership._id),
        role: membership.role as RoleName
      })
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Refresh session is invalid or expired.", "REFRESH_INVALID");
  }
}

export async function acceptInvite(input: {
  token: string; firstName: string; lastName: string; password: string;
}) {
  const invite = await Invite.findOne({ tokenHash: hashToken(input.token), acceptedAt: null, expiresAt: { $gt: new Date() } });
  if (!invite) throw new ApiError(400, "Invite is invalid or expired.", "INVITE_INVALID");

  let user = await User.findOne({ email: invite.email });
  if (!user) {
    user = await User.create({
      email: invite.email,
      passwordHash: await bcrypt.hash(input.password, 12),
      firstName: input.firstName,
      lastName: input.lastName,
      emailVerified: true
    });
  }

  const existing = await Membership.findOne({ organizationId: invite.organizationId, userId: user._id });
  const membership = existing ?? await Membership.create({
    organizationId: invite.organizationId,
    userId: user._id,
    role: invite.role,
    status: "active",
    joinedAt: new Date()
  });

  invite.acceptedAt = new Date();
  await invite.save();

  const payload = {
    sub: String(user._id),
    org: String(invite.organizationId),
    membership: String(membership._id),
    role: membership.role as RoleName
  };

  return {
    user: user.toObject(),
    organization: await Organization.findById(invite.organizationId).lean(),
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
}
