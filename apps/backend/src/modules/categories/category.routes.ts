import { Router } from "express";
import CategoryController from "./category.controller";
import { verifyAdmin, verifyToken } from "../../core/middleware/auth.middleware";
import { validationMiddleware } from "../../core/middleware/validation.middleware";
import { CreateCategoryDTO } from "./category.types";

const router = Router();

router.post(
  "/", 
  verifyToken, 
  verifyAdmin, 
  validationMiddleware(CreateCategoryDTO), 
  CategoryController.createCategory
);
router.get("/", CategoryController.getAllCategories);

export default router;