import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { RoleName } from "./permissions.js";

interface TokenPayload {
  sub: string;
  org: string;
  membership: string;
  role: RoleName;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.accessSecret, { expiresIn: env.accessTtl as any });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshTtl as any });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.refreshSecret) as TokenPayload;
}
