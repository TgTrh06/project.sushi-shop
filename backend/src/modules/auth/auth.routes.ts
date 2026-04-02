import { Router } from "express";
import { AuthController } from "./auth.controller";
import { loginRateLimiter } from "../../config/rateLimit.config";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", loginRateLimiter, AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
