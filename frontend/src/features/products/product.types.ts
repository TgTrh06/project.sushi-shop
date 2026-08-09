import { z } from "zod";
import type { BaseProductSchema } from "@itsu-sushi/shared/schemas/product.schema";
import type { BaseReviewSchema } from "@itsu-sushi/shared/schemas/review.schema";

export type Product = z.infer<typeof BaseProductSchema>;

export type Review = z.infer<typeof BaseReviewSchema>;

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  hasMore: boolean;
}
