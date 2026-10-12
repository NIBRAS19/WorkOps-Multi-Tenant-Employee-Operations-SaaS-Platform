import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { announcementSchema } from "../validators/announcement.js";
import * as controller from "../controllers/announcement.controller.js";

export const announcementRouter = Router();
announcementRouter.use(requireAuth);
announcementRouter.get("/", requirePermission("announcement.read"), asyncHandler(controller.list));
announcementRouter.post("/", requirePermission("announcement.manage"), validate(announcementSchema), asyncHandler(controller.create));
announcementRouter.delete("/:id", requirePermission("announcement.manage"), asyncHandler(controller.remove));
