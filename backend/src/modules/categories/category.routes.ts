import { Router } from "express";
import CategoryController from "./category.controller";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";

const router = Router();

router.post(
  "/", 
  verifyAuth, 
  verifyAdmin, 
  CategoryController.createCategory
);
router.get("/", CategoryController.getAllCategories);

export default router;