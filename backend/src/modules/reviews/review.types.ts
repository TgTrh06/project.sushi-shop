import { z } from "zod";
import { BaseReviewSchema, CreateReviewSchema } from "@shared/schemas/review.schema";

export type ReviewEntity = z.infer<typeof BaseReviewSchema>;
export type ReviewDocument = Omit<ReviewEntity, "id" | "user"> & {
  userId: any;
};
export type CreateReviewDTO = z.input<typeof CreateReviewSchema>;
