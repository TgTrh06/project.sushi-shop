import { Router } from "express";
import CategoryController from "./category.controller";
import { verifyAccessToken, authorize } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/", 
  verifyAccessToken, 
  authorize("admin"), 
  CategoryController.createCategory
);
router.get("/", CategoryController.getAllCategories);

export default router;