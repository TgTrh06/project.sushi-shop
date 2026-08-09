import { Router } from "express";
import { verifyAuth, verifyAdmin } from "../../../middleware/auth.middleware";
import { userController } from "@/composition-root";

const router = Router();

// ==========================================
// ADMIN ROUTES (verifyToken & verifyAdmin)
// ==========================================
router.get("/users", verifyAuth, verifyAdmin, userController.getUsers);
router.get("/staffs", verifyAuth, verifyAdmin, userController.getStaffs)
router.get("/:id", verifyAuth, verifyAdmin, userController.getOneById);
router.delete("/:id", verifyAuth, verifyAdmin, userController.delete);

export default router;
