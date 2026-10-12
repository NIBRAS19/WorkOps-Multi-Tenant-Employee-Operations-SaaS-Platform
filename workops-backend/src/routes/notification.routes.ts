import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/notification.controller.js";

export const notificationRouter = Router();
notificationRouter.use(requireAuth);
notificationRouter.get("/", asyncHandler(controller.list));
notificationRouter.get("/unread-count", asyncHandler(controller.unreadCount));
notificationRouter.patch("/:id/read", asyncHandler(controller.read));
notificationRouter.patch("/read-all", asyncHandler(controller.readAll));
