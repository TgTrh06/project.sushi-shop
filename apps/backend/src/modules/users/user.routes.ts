import { Router } from "express";
import UserController from "./user.controller";
import { verifyToken, verifyAdmin } from "../../core/middleware/auth.middleware";

const router = Router();

// ==========================================
// CUSTOMER ROUTES (verifyToken)
// ==========================================
router.get("/me", verifyToken, UserController.getProfile);
router.put("/me", verifyToken, UserController.getProfile);

// ==========================================
// ADMIN ROUTES (verifyToken & verifyAdmin)
// ==========================================
router.get("/", verifyToken, verifyAdmin, UserController.getAllUsers);
router.get("/:id", verifyToken, verifyAdmin, UserController.getUserById);
router.delete("/:id", verifyToken, verifyAdmin, UserController.deleteUser);

export default router;