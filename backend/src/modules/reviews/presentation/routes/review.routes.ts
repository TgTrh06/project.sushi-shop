import { Router } from "express";
import { validateBody } from "@/core/http/validation.middleware";
import { CreateReviewSchema } from "@itsu-sushi/shared/schemas/review.schema";
import type { ReviewController } from "../controllers/review.controller";

export function createReviewRoutes(controller: ReviewController, auth: any, admin: any) {
  const router = Router();
  router.get("/:id/paginated", controller.getProduct);
  router.get("/", auth, admin, controller.getAll);
  router.post("/", auth, validateBody(CreateReviewSchema), controller.createHandler);
  router.delete("/:id", auth, controller.deleteHandler);
  return router;
}
