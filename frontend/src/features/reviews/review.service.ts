import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { Review, PaginatedReviews } from "@/features/products/product.types";

export const reviewService = {
  async getProductReviews(productId: string): Promise<Review[]> {
    const res = await api.get<ApiResponse<Review[]>>(`/reviews/product/${productId}`);
    return res.data.data;
  },

  async getProductReviewsPaginated(
    productId: string,
    page: number,
    limit: number = 5
  ): Promise<PaginatedReviews> {
    const res = await api.get<ApiResponse<PaginatedReviews>>(`/reviews/paginated`, {
      params: { productId, page, limit }
    });
    return res.data.data;
  },

  async addReview(productId: string, rating: number, comment: string): Promise<Review> {
    const res = await api.post<ApiResponse<Review>>("/reviews", {
      productId,
      rating,
      comment,
    });
    return res.data.data;
  },

  async deleteReview(id: string): Promise<void> {
    await api.delete(`/reviews/${id}`);
  },
};
