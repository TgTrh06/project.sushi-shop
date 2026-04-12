import { Router } from "express";
import { verifyAuth, verifyAdmin } from "../../../middleware/auth.middleware";
import { UpdateUserSchema } from "@shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";
import { userController } from "@/container/user.container";

const router = Router();

// ==========================================
// USER ROUTES (verifyToken)
// ==========================================
router.get("/me", verifyAuth, userController.getMe);
router.put("/me", 
  verifyAuth, 
  zodValidator(UpdateUserSchema),
  userController.update
);

export default router;