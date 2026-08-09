import { Router } from "express";
import { AuthController } from "./auth.controller";
import { loginRateLimiter, refreshRateLimiter } from "../../config/rateLimit.config";
import { LoginSchema, RegisterSchema } from "@itsu-sushi/shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post("/register", loginRateLimiter, zodValidator(RegisterSchema), controller.register);
  router.post("/login", loginRateLimiter, zodValidator(LoginSchema), controller.login);
  router.post("/logout", controller.logout);
  router.post("/refresh", refreshRateLimiter, controller.refresh);

  return router;
}
