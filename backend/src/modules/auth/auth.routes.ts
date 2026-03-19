import { Router } from "express";

import AuthController from "./auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Verify Token before logging out
router.post("/logout", verifyToken, AuthController.logout);

export default router;