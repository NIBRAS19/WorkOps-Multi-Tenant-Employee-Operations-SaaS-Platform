import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { policySchema, requestSchema, reviewSchema } from "../validators/leave.js";
import * as controller from "../controllers/leave.controller.js";

export const leaveRouter = Router();
leaveRouter.use(requireAuth);
leaveRouter.get("/policies", requirePermission("leave.read"), asyncHandler(controller.listPolicies));
leaveRouter.post("/policies", requirePermission("leave.manage"), validate(policySchema), asyncHandler(controller.createPolicy));
leaveRouter.get("/requests", requirePermission("leave.read"), asyncHandler(controller.listRequests));
leaveRouter.post("/requests", requirePermission("leave.create"), validate(requestSchema), asyncHandler(controller.createRequest));
leaveRouter.patch("/requests/:id/review", requirePermission("leave.approve"), validate(reviewSchema), asyncHandler(controller.review));
leaveRouter.patch("/requests/:id/cancel", requirePermission("leave.create"), asyncHandler(controller.cancel));
