import { Router } from "express";
import UserController from "./user.controller";
import { verifyAccessToken, verifyAdmin } from "../../middleware/auth.middleware";

const router = Router();

// ==========================================
// CUSTOMER ROUTES (verifyToken)
// ==========================================
router.get("/me", verifyAccessToken, UserController.getProfile);
router.put("/me", verifyAccessToken, UserController.getProfile);

// ==========================================
// ADMIN ROUTES (verifyToken & verifyAdmin)
// ==========================================
router.get("/", verifyAccessToken, verifyAdmin, UserController.getAllUsers);
router.get("/:id", verifyAccessToken, verifyAdmin, UserController.getUserById);
router.delete("/:id", verifyAccessToken, verifyAdmin, UserController.deleteUser);

export default router;