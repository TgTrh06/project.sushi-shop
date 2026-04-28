import { Router } from "express";
import { reviewController } from "@/container/review.container";
import { verifyAuth } from "@/middleware/auth.middleware";
import { zodValidator } from "@/middleware/validate.middleware";
import { CreateReviewSchema } from "@shared/schemas/review.schema";

const router = Router();

// Get paginated reviews for a product (Public)
router.get("/:productId/paginated", reviewController.getByProductPaginated);

// Add a review (Protected)
router.post(
  "/",
  verifyAuth,
  zodValidator(CreateReviewSchema),
  reviewController.create
);

// Delete a review (Protected)
router.delete("/:id", verifyAuth, reviewController.delete);

export default router;
