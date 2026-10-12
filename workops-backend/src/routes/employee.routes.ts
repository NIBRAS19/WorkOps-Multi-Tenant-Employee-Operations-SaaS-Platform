import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createEmployeeSchema, employeeIdSchema, updateEmployeeSchema } from "../validators/employee.js";
import * as controller from "../controllers/employee.controller.js";

export const employeeRouter = Router();
employeeRouter.use(requireAuth);
employeeRouter.get("/", requirePermission("employee.read"), asyncHandler(controller.list));
employeeRouter.post("/", requirePermission("employee.create"), validate(createEmployeeSchema), asyncHandler(controller.create));
employeeRouter.get("/:id", requirePermission("employee.read"), validate(employeeIdSchema), asyncHandler(controller.get));
employeeRouter.patch("/:id", requirePermission("employee.update"), validate(updateEmployeeSchema), asyncHandler(controller.update));
employeeRouter.delete("/:id", requirePermission("employee.delete"), validate(employeeIdSchema), asyncHandler(controller.remove));
employeeRouter.post("/:id/account", requirePermission("user.manage"), validate(employeeIdSchema), asyncHandler(controller.createUserAccount));
