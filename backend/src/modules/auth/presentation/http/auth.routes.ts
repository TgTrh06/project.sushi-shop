import { Router } from "express";
import { validateBody } from "@/core/http/validation.middleware";
import { LoginSchema, RegisterSchema } from "./auth.validator";
import type { AuthController } from "./auth.controller";

export function createAuthRoutes(controller: AuthController, rateLimiters: { auth: any; refresh: any }) {
  const router = Router();
  router.post("/register", rateLimiters.auth, validateBody(RegisterSchema), controller.register);
  router.post("/login", rateLimiters.auth, validateBody(LoginSchema), controller.login);
  router.post("/logout", controller.logout);
  router.post("/refresh", rateLimiters.refresh, controller.refresh);
  return router;
}
