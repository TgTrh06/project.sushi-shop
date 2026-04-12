import { productController } from "@/container/product.container";
import { verifyAdmin, verifyAuth } from "@/middleware/auth.middleware";
import { zodValidator } from "@/middleware/validate.middleware";
import { Router } from "express";
import { CreateProductSchema } from "./product.types";
import { UpdateCategorySchema } from "../categories/category.types";

const router = Router();

// GENERAL ROUTES
router.get("/", productController.getAll);
router.get("/:slug", productController.getOneBySlug);
router.get("/category/:slug", productController.getListByCategory);

// ADMIN ROUTES
router.post(
  "/",
  verifyAuth,
  verifyAdmin,
  zodValidator(CreateProductSchema),
  productController.create,
);
router.put(
  "/:id",
  verifyAuth,
  verifyAdmin,
  zodValidator(UpdateCategorySchema),
  productController.update,
);
router.delete("/:id", verifyAuth, verifyAdmin, productController.delete);

export default router;
