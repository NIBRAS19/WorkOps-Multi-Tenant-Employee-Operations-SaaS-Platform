import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateSettingsSchema } from "../validators/settings.js";
import * as controller from "../controllers/settings.controller.js";

export const settingsRouter = Router();
settingsRouter.use(requireAuth);
settingsRouter.get("/organization", requirePermission("settings.read"), asyncHandler(controller.getOrganization));
settingsRouter.patch("/organization", requirePermission("settings.manage"), validate(updateSettingsSchema), asyncHandler(controller.updateOrganization));
settingsRouter.get("/members", requirePermission("user.manage"), asyncHandler(controller.members));
settingsRouter.patch("/members/:id/role", requirePermission("user.manage"), asyncHandler(controller.changeRole));
settingsRouter.post("/invitations", requirePermission("user.manage"), asyncHandler(controller.invite));
