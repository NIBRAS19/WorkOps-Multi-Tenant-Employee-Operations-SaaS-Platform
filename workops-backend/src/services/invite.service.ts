import { Invite } from "../models/Invite.js";
import { Membership } from "../models/Membership.js";
import { Role } from "../models/Role.js";
import { rolePermissions } from "../utils/permissions.js";
import { randomToken, hashToken } from "../utils/crypto.js";
import { ApiError } from "../utils/apiError.js";

export async function createInvite(input: {
  organizationId: string;
  invitedBy: string;
  email: string;
  role: "admin" | "manager" | "employee";
}) {
  const token = randomToken(32);
  const invite = await Invite.create({
    organizationId: input.organizationId,
    email: input.email,
    role: input.role,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 7 * 86400000),
    invitedBy: input.invitedBy
  });
  return { invite, token };
}

export async function ensureSystemRoles(organizationId: string) {
  for (const [key, permissions] of Object.entries(rolePermissions)) {
    await Role.updateOne(
      { organizationId, key },
      { $setOnInsert: { name: key.charAt(0).toUpperCase() + key.slice(1), key, permissions, isSystem: true } },
      { upsert: true }
    );
  }
}
