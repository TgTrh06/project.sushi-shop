import { Router } from "express";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";
import { reviewController } from "@/container/review.container";
import { zodValidator } from "@/middleware/validate.middleware";
import { CreateReviewSchema } from "@shared/schemas/review.schema";

const router = Router();

// Get paginated reviews for a product (Public)
router.get("/:id/paginated", reviewController.getByProductPaginated);

// Admin: Get all reviews with pagination + filters
router.get("/", verifyAuth, verifyAdmin, reviewController.getAllReviews);

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
