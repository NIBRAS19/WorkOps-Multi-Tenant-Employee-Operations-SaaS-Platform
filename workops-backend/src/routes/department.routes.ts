import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/department.controller.js";

export const departmentRouter = Router();
departmentRouter.use(requireAuth);
departmentRouter.get("/", requirePermission("employee.read"), asyncHandler(controller.list));
departmentRouter.post("/", requirePermission("employee.create"), asyncHandler(controller.create));
departmentRouter.patch("/:id", requirePermission("employee.update"), asyncHandler(controller.update));
departmentRouter.delete("/:id", requirePermission("employee.delete"), asyncHandler(controller.remove));
departmentRouter.get("/teams", requirePermission("employee.read"), asyncHandler(controller.teams));
departmentRouter.post("/teams", requirePermission("employee.create"), asyncHandler(controller.createTeam));
departmentRouter.patch("/teams/:id", requirePermission("employee.update"), asyncHandler(controller.updateTeam));
departmentRouter.delete("/teams/:id", requirePermission("employee.delete"), asyncHandler(controller.removeTeam));
