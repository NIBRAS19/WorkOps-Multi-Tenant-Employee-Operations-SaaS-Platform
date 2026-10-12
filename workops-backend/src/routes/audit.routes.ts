import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/audit.controller.js";

export const auditRouter = Router();
auditRouter.use(requireAuth);
auditRouter.get("/", requirePermission("audit.read"), asyncHandler(controller.list));
