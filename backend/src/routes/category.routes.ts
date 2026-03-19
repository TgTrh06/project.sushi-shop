import { Router } from "express";
import * as controller from "../modules/categories/category.controller";
import { verifyAdmin, verifyToken } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateCategoryDTO } from "../modules/categories/category.types";

const router = Router();

router.post(
  "/", 
  verifyToken, 
  verifyAdmin, 
  validationMiddleware(CreateCategoryDTO), 
  controller.createCategory
);
router.get("/", controller.getAllCategories);

export default router;