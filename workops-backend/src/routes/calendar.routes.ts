import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/calendar.controller.js";

export const calendarRouter = Router();
calendarRouter.use(requireAuth);
calendarRouter.get("/", requirePermission("calendar.read"), asyncHandler(controller.list));
calendarRouter.post("/", requirePermission("calendar.manage"), asyncHandler(controller.create));
calendarRouter.patch("/:id", requirePermission("calendar.manage"), asyncHandler(controller.update));
calendarRouter.delete("/:id", requirePermission("calendar.manage"), asyncHandler(controller.remove));
