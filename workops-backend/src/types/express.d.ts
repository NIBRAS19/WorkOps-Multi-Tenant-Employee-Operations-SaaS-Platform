import type { RoleName } from "../utils/permissions.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        organizationId: string;
        membershipId: string;
        role: RoleName;
      };
      file?: Express.Multer.File;
    }
  }
}

export {};
