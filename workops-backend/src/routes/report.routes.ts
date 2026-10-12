import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/report.controller.js";

export const reportRouter = Router();
reportRouter.use(requireAuth);
reportRouter.get("/overview", requirePermission("report.read"), asyncHandler(controller.overview));
reportRouter.get("/attendance", requirePermission("report.read"), asyncHandler(controller.attendance));
reportRouter.get("/leave", requirePermission("report.read"), asyncHandler(controller.leave));
