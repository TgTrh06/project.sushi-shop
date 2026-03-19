import { Router } from "express";

import AuthController from "./auth.controller";
import { verifyToken } from "../../core/middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Đăng nhập vào hệ thống
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/LoginInput'  <-- Gọi lại Schema cực gọn
 * responses:
 * 200:
 * description: Đăng nhập thành công
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * 400:
 * description: Sai email hoặc mật khẩu
 */
router.post("/login", AuthController.login);

// Verify Token before logging out
router.post("/logout", verifyToken, AuthController.logout);

export default router;