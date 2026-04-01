import { Router } from "express";
import CategoryController from "./category.controller";
import { verifyAdmin, verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/", 
  verifyToken, 
  verifyAdmin, 
  CategoryController.createCategory
);
router.get("/", CategoryController.getAllCategories);

export default router;