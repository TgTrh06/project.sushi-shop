import { Router } from "express";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";
import { zodValidator } from "@/middleware/validate.middleware";
import { CreateCategorySchema, UpdateCategorySchema } from "./category.types";
import { categoryController } from "@/container/category.container";

const router = Router();

// GENERAL ROUTES
router.get("/", categoryController.getAll);
router.get("/:slug", categoryController.getOneBySlug);

// ADMIN ROUTES
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
  categoryController.update,
);
router.delete("/:id", verifyAuth, verifyAdmin, categoryController.delete);

export default router;
