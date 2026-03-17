import { Router } from "express";
import UserController from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Route to get profile of the current logged-in user
router.get("/me", verifyToken, UserController.getProfile);

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;