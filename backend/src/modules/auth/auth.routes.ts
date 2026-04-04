import { Router } from "express";
import { AuthController } from "./auth.controller";
import { loginRateLimiter } from "../../config/rateLimit.config";
import { LoginInputSchema, RegisterInputSchema } from "@shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";

const router = Router();

router.post(
  "/register", 
  zodValidator(RegisterInputSchema),
  AuthController.register
);
router.post("/login", 
  loginRateLimiter, 
  zodValidator(LoginInputSchema),
  AuthController.login
);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
