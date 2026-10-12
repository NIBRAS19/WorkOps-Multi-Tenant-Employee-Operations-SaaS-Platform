import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadSingle } from "../middlewares/upload.js";
import * as controller from "../controllers/document.controller.js";

export const documentRouter = Router();
documentRouter.use(requireAuth);
documentRouter.get("/", requirePermission("document.read"), asyncHandler(controller.list));
documentRouter.post("/", requirePermission("document.upload"), uploadSingle, asyncHandler(controller.upload));
documentRouter.get("/:id", requirePermission("document.read"), asyncHandler(controller.get));
documentRouter.get("/:id/download", requirePermission("document.read"), asyncHandler(controller.download));
documentRouter.get("/:id/versions", requirePermission("document.read"), asyncHandler(controller.versions));
documentRouter.delete("/:id", requirePermission("document.manage"), asyncHandler(controller.archive));
