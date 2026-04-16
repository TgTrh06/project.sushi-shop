import { Router } from "express";
import { AuthController } from "./auth.controller";
import { loginRateLimiter } from "../../config/rateLimit.config";
import { LoginSchema, RegisterSchema } from "@shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";

const router = Router();

router.post(
  "/register", 
  zodValidator(RegisterSchema),
  AuthController.register
);
router.post("/login", 
  loginRateLimiter, 
  zodValidator(LoginSchema),
  AuthController.login
);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);

export default router;
