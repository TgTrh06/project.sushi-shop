import { Router } from "express";
import CategoryController from "./category.controller";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";
import { zodValidator } from "@/middleware/validate.middleware";
import { CreateCategorySchema, UpdateCategorySchema } from "./category.types";

const router = Router();
const categoryController = new CategoryController();

router.get("/", categoryController.getAll);
router.get("/:slug", categoryController.getOneBySlug);

router.post(
  "/",
  verifyAuth,
  verifyAdmin,
  zodValidator(CreateCategorySchema),
  categoryController.create,
);
router.put(
  "/:id",
  verifyAuth,
  verifyAdmin,
  zodValidator(UpdateCategorySchema), 
  categoryController.update
);
router.delete(
  "/:id",
  verifyAuth,
  verifyAdmin, 
  categoryController.delete
);

export default router;
