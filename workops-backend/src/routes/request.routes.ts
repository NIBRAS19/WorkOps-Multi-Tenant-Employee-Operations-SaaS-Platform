import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createRequestSchema, updateRequestSchema } from "../validators/request.js";
import * as controller from "../controllers/request.controller.js";

export const requestRouter = Router();
requestRouter.use(requireAuth);
requestRouter.get("/", requirePermission("request.read"), asyncHandler(controller.list));
requestRouter.post("/", requirePermission("request.create"), validate(createRequestSchema), asyncHandler(controller.create));
requestRouter.patch("/:id", requirePermission("request.manage"), validate(updateRequestSchema), asyncHandler(controller.update));
