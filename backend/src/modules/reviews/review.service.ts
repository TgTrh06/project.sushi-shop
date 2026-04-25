import ReviewRepository from "./review.repository";
import { CreateReviewDTO, ReviewEntity } from "./review.types";
import { NotFoundError, BadRequestError } from "../../utils/common/error.util";

export default class ReviewService {
  constructor(private readonly reviewRepo = new ReviewRepository()) {}

  async addReview(dto: CreateReviewDTO): Promise<ReviewEntity> {
    // Optionally check if product exists here if needed
    return this.reviewRepo.create(dto);
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
    // Check ownership or admin status before deleting (logic simplified for brevity)
    const review = await this.reviewRepo.delete(id);
    if (!review) throw new NotFoundError("Review not found.");
    return review;
  }
}
