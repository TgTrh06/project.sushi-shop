import { Router } from "express";
import UserController from "./user.controller";
import { verifyAuth, verifyAdmin } from "../../middleware/auth.middleware";
import { UpdateUserInputSchema } from "@shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";

const router = Router();

// ==========================================
// CUSTOMER ROUTES (verifyToken)
// ==========================================
router.get("/me", verifyAuth, UserController.getMe);
router.put("/me", 
  verifyAuth, 
  zodValidator(UpdateUserInputSchema),
  UserController.update
);

// ==========================================
// ADMIN ROUTES (verifyToken & verifyAdmin)
// ==========================================
router.get("/", verifyAuth, verifyAdmin, UserController.getAll);
router.get("/:id", verifyAuth, verifyAdmin, UserController.getOneById);
router.delete("/:id", verifyAuth, verifyAdmin, UserController.delete);

export default router;