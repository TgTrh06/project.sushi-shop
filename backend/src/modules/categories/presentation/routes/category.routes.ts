import { Router } from "express";
import { validateBody } from "@/core/http/validation.middleware";
import { CreateCategorySchema, UpdateCategorySchema } from "../validators/category.validator";
import type { CategoryController } from "../controllers/category.controller";

export function createCategoryRoutes(controller: CategoryController, auth: any, admin: any) {
  const router = Router();
  router.get("/", controller.getAll);
  router.get("/:slug", controller.getOne);
  router.post("/", auth, admin, validateBody(CreateCategorySchema), controller.createHandler);
  router.put("/:id", auth, admin, validateBody(UpdateCategorySchema), controller.updateHandler);
  router.delete("/:id", auth, admin, controller.deleteHandler);
  return router;
}
