import { Router } from "express";
import UserController from "./user.controller";
import { verifyAccessToken, authorize } from "../../middleware/auth.middleware";

const router = Router();

// ==========================================
// CUSTOMER ROUTES (verifyToken)
// ==========================================
router.get("/me", verifyAccessToken, UserController.getProfile);
router.put("/me", verifyAccessToken, UserController.getProfile);

// ==========================================
// ADMIN ROUTES (verifyToken & verifyAdmin)
// ==========================================
router.get("/", verifyAccessToken, authorize("admin"), UserController.getAllUsers);
router.get("/:id", verifyAccessToken, authorize("admin"), UserController.getUserById);
router.delete("/:id", verifyAccessToken, authorize("admin"), UserController.deleteUser);

export default router;