import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requirePermission } from "../middlewares/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/asset.controller.js";

export const assetRouter = Router();
assetRouter.use(requireAuth);
assetRouter.get("/", requirePermission("asset.read"), asyncHandler(controller.list));
assetRouter.post("/", requirePermission("asset.manage"), asyncHandler(controller.create));
assetRouter.patch("/:id", requirePermission("asset.manage"), asyncHandler(controller.update));
assetRouter.post("/:id/assign", requirePermission("asset.manage"), asyncHandler(controller.assign));
assetRouter.post("/:id/return", requirePermission("asset.manage"), asyncHandler(controller.returnAsset));
