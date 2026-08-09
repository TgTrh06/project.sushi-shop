import ReviewRepository from "./review.repository";
import { CreateReviewDTO, ReviewEntity } from "./review.types";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../utils/common/error.util";
import * as cloudinaryService from "@/modules/upload/cloudinary.service";
import ProductRepository from "@/modules/products/product.repository";

export default class ReviewService {
  constructor(
    private readonly reviewRepo = new ReviewRepository(),
    private readonly productRepo = new ProductRepository(),
  ) {}

  async addReview(dto: CreateReviewDTO): Promise<ReviewEntity> {
    const product = await this.productRepo.findById(dto.productId);
    if (!product) throw new NotFoundError("Product not found.");
    return this.reviewRepo.create(dto);
  }

  async getAllReviewsPaginated(
    page: number,
    limit: number,
    email?: string,
    date?: string,
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{ reviews: ReviewEntity[]; total: number; page: number; totalPages: number }> {
    if (page < 1) throw new BadRequestError("Page must be at least 1.");
    if (limit < 1 || limit > 100) throw new BadRequestError("Limit must be between 1 and 100.");

    const skip = (page - 1) * limit;
    const { docs, total } = await this.reviewRepo.findAllPaginated(skip, limit, email, date, sortOrder);

    return {
      reviews: docs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductReviews(productId: string): Promise<ReviewEntity[]> {
    return this.reviewRepo.findByProductId(productId);
  }

  async getProductReviewsPaginated(
    productId: string,
    page: number,
    limit: number
  ): Promise<{ reviews: ReviewEntity[]; total: number; page: number; hasMore: boolean }> {
    // Validate pagination params
    if (page < 1) {
      throw new BadRequestError("Page must be at least 1.");
    }
    if (limit < 1 || limit > 50) {
      throw new BadRequestError("Limit must be between 1 and 50.");
    }

    const skip = (page - 1) * limit;
    const { docs, total } = await this.reviewRepo.findByProductIdPaginated(productId, skip, limit);

    return {
      reviews: docs,
      total,
      page,
      hasMore: skip + limit < total
    };
  }

  async getUserReviews(userId: string): Promise<ReviewEntity[]> {
    return this.reviewRepo.findByUserId(userId);
  }

  async deleteReview(id: string, userId: string, isAdmin: boolean): Promise<ReviewEntity> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundError("Review not found.");

    if (!isAdmin && review.user.id !== userId) {
      throw new ForbiddenError("You can only delete your own review.");
    }

    // Clean up Cloudinary photos before deletion
    if (review.photo_ids && review.photo_ids.length > 0) {
      try {
        await cloudinaryService.deleteMultiple(review.photo_ids);
      } catch (error) {
        console.error("Failed to delete review photos from Cloudinary:", error);
        // Continue with deletion even if Cloudinary cleanup fails
      }
    }

    const deletedReview = await this.reviewRepo.delete(id);
    if (!deletedReview) throw new NotFoundError("Review not found.");
    return deletedReview;
  }
}
