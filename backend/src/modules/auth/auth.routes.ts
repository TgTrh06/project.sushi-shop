import { Router } from "express";
import { AuthController } from "./auth.controller";
import { loginRateLimiter } from "../../config/rateLimit.config";
import { LoginInputSchema, RegisterInputSchema } from "@shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";

const router = Router();

router.post(
  "/sign-up", 
  zodValidator(RegisterInputSchema),
  AuthController.register
);
router.post("/sign-in", 
  loginRateLimiter, 
  zodValidator(LoginInputSchema),
  AuthController.login
);
router.post("/sign-out", AuthController.logout);
router.post("/refresh", AuthController.refresh);

export default router;
