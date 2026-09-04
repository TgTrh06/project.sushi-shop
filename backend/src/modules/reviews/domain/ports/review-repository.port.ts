import type { ReviewEntity, CreateReviewInput } from "../entities/review.entity";

export interface ReviewRepository {
  create(input: CreateReviewInput): Promise<ReviewEntity>;
  findById(id: string): Promise<ReviewEntity | null>;
  delete(id: string): Promise<ReviewEntity | null>;
  findByProduct(productId: string): Promise<ReviewEntity[]>;
  findByProductPaginated(productId: string, skip: number, limit: number): Promise<{ data: ReviewEntity[]; total: number }>;
  findAllPaginated(skip: number, limit: number, email?: string, date?: string, sortOrder?: "asc" | "desc"): Promise<{ data: ReviewEntity[]; total: number }>;
  calculateRating(productId: string): Promise<{ averageRating: number; totalReviews: number }>;
}
