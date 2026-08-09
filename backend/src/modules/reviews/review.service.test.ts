import { describe, expect, it } from "vitest";
import type ReviewRepository from "./review.repository";
import type ProductRepository from "@/modules/products/product.repository";
import ReviewService from "./review.service";
import type { ReviewEntity } from "./review.types";

const review: ReviewEntity = {
  id: "review-1",
  productId: "product-1",
  product: { slug: "sushi", name: "Sushi" },
  user: { id: "owner-1", name: "Owner", email: "owner@example.com" },
  rating: 5,
  comment: "Excellent",
  photo_ids: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ReviewService", () => {
  it("rejects a review when its product does not exist", async () => {
    const reviewRepository = { create: async () => review };
    const productRepository = { findById: async () => null };
    const service = new ReviewService(
      reviewRepository as unknown as ReviewRepository,
      productRepository as unknown as ProductRepository,
    );

    await expect(service.addReview({
      productId: "missing",
      rating: 5,
      comment: "Excellent",
      photo_ids: [],
    })).rejects.toThrow("Product not found");
  });

  it("prevents a user from deleting another user's review", async () => {
    const reviewRepository = { findById: async () => review };
    const service = new ReviewService(
      reviewRepository as unknown as ReviewRepository,
      { findById: async () => ({ id: "product-1" }) } as unknown as ProductRepository,
    );

    await expect(service.deleteReview("review-1", "another-user", false))
      .rejects.toThrow("only delete your own review");
  });
});
