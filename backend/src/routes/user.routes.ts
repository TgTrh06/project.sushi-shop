import { Router } from "express";
import UserController from "../modules/users/user.controller";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

// 1. API for CUSTOMER
router.get("/me", verifyToken, UserController.getProfile);
router.put("/me", verifyToken, UserController.getProfile);

// 2. API for ADMIN
router.get("/", verifyToken, verifyAdmin, UserController.getAllUsers);
router.get("/:id", verifyToken, verifyAdmin, UserController.getUserById);
router.delete("/:id", verifyToken, verifyAdmin, UserController.deleteUser);

export default router;