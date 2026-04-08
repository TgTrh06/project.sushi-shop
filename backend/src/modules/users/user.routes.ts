import { Router } from "express";
import { verifyAuth, verifyAdmin } from "../../middleware/auth.middleware";
import { UpdateUserInputSchema } from "@shared/schemas/auth.schema";
import { zodValidator } from "@/middleware/validate.middleware";
import { userController } from "@/container/user.container";

const router = Router();

// ==========================================
// CUSTOMER ROUTES (verifyToken)
// ==========================================
router.get("/me", verifyAuth, userController.getMe);
router.put("/me", 
  verifyAuth, 
  zodValidator(UpdateUserInputSchema),
  userController.update
);

// ==========================================
// ADMIN ROUTES (verifyToken & verifyAdmin)
// ==========================================
router.get("/", verifyAuth, verifyAdmin, userController.getAll);
router.get("/:id", verifyAuth, verifyAdmin, userController.getOneById);
router.delete("/:id", verifyAuth, verifyAdmin, userController.delete);

export default router;