import { z } from "zod";
import type { BaseProductSchema } from "@shared/schemas/product.schema";
import type { BaseReviewSchema } from "@shared/schemas/review.schema";

export type Product = z.infer<typeof BaseProductSchema>;

export type Review = z.infer<typeof BaseReviewSchema>;

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  hasMore: boolean;
}
