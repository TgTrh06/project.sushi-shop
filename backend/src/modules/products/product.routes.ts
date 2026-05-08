import { productController } from "@/container/product.container";
import { verifyAdmin, verifyAuth } from "@/middleware/auth.middleware";
import { zodValidator } from "@/middleware/validate.middleware";
import { Router } from "express";
import { CreateProductSchema, UpdateProductSchema } from "./product.types";

const router = Router();

// GENERAL ROUTES
router.get("/", productController.getAll);
router.get("/category/:slug", productController.getListByCategory);
router.get("/:slug", productController.getOneBySlug);

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
  zodValidator(UpdateProductSchema),
  productController.update,
);
router.delete("/:id", verifyAuth, verifyAdmin, productController.delete);

export default router;
