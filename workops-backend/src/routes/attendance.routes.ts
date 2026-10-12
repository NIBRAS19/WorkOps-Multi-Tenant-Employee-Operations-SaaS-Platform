import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/attendance.controller.js";

export const attendanceRouter = Router();
attendanceRouter.use(requireAuth);
attendanceRouter.get("/today", requirePermission("attendance.read"), asyncHandler(controller.today));
attendanceRouter.post("/clock-in", requirePermission("attendance.read"), asyncHandler(controller.clockIn));
attendanceRouter.post("/clock-out", requirePermission("attendance.read"), asyncHandler(controller.clockOut));
attendanceRouter.get("/", requirePermission("attendance.read"), asyncHandler(controller.list));
attendanceRouter.put("/", requirePermission("attendance.manage"), asyncHandler(controller.upsertAdmin));
