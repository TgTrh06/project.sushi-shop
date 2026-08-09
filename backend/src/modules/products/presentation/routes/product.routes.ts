import { Router } from "express";
import { validateBody } from "@/core/http/validation.middleware";
import { CreateProductSchema, UpdateProductSchema } from "../validators/product.validator";
import type { ProductController } from "../controllers/product.controller";

export function createProductRoutes(controller: ProductController, auth: any, admin: any) {
  const router = Router();
  router.get("/", controller.getAll);
  router.get("/category/:slug", controller.getByCategory);
  router.get("/:slug", controller.getBySlug);
  router.post("/", auth, admin, validateBody(CreateProductSchema), controller.createHandler);
  router.put("/:id", auth, admin, validateBody(UpdateProductSchema), controller.updateHandler);
  router.delete("/:id", auth, admin, controller.deleteHandler);
  return router;
}
