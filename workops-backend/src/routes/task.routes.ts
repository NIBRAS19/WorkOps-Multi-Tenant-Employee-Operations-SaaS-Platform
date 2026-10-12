import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.js";
import * as controller from "../controllers/task.controller.js";

export const taskRouter = Router();
taskRouter.use(requireAuth);
taskRouter.get("/", requirePermission("task.read"), asyncHandler(controller.list));
taskRouter.post("/", requirePermission("task.create"), validate(createTaskSchema), asyncHandler(controller.create));
taskRouter.get("/:id", requirePermission("task.read"), asyncHandler(controller.get));
taskRouter.patch("/:id", requirePermission("task.update"), validate(updateTaskSchema), asyncHandler(controller.update));
taskRouter.delete("/:id", requirePermission("task.delete"), asyncHandler(controller.remove));
