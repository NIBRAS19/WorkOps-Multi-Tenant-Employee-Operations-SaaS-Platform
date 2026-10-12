import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/dashboard.controller.js";
export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);
dashboardRouter.get("/summary", asyncHandler(controller.summary));
