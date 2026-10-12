import { Router } from "express";
import cookieParser from "cookie-parser";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.js";
import { acceptInviteSchema, loginSchema, refreshSchema, registerSchema } from "../validators/auth.js";
import * as controller from "../controllers/auth.controller.js";
import { acceptInvite } from "../services/auth.service.js";

export const authRouter = Router();
authRouter.use(cookieParser());

authRouter.post("/register", validate(registerSchema), asyncHandler(controller.registerController));
authRouter.post("/login", validate(loginSchema), asyncHandler(controller.loginController));
authRouter.post("/refresh", validate(refreshSchema), asyncHandler(controller.refreshController));
authRouter.post("/logout", asyncHandler(controller.logoutController));
authRouter.get("/me", requireAuth, asyncHandler(controller.meController));
authRouter.post("/switch-organization", requireAuth, asyncHandler(controller.switchOrganizationController));

authRouter.post("/accept-invite", validate(acceptInviteSchema), asyncHandler(async (req, res) => {
  const result = await acceptInvite(req.body);
  res.json({ success: true, data: { user: result.user, organization: result.organization, accessToken: result.accessToken, refreshToken: result.refreshToken } });
}));
