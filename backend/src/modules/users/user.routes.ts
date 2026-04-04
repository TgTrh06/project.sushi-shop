import { Router } from "express";
import UserController from "./user.controller";
import { verifyAuth, verifyAdmin } from "../../middleware/auth.middleware";
import { UpdateUserInputSchema } from "@shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";

const router = Router();

// ==========================================
// CUSTOMER ROUTES (verifyToken)
// ==========================================
router.get("/me", verifyAuth, UserController.getProfile);
router.put("/me", 
  verifyAuth, 
  zodValidator(UpdateUserInputSchema),
  UserController.updateProfile
);

// ==========================================
// ADMIN ROUTES (verifyToken & verifyAdmin)
// ==========================================
router.get("/", verifyAuth, verifyAdmin, UserController.getAllUsers);
router.get("/:id", verifyAuth, verifyAdmin, UserController.getUserById);
router.delete("/:id", verifyAuth, verifyAdmin, UserController.deleteUser);

export default router;