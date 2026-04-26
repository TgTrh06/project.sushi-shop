import type z from "zod";
import type { BaseReviewSchema } from "@shared/schemas/review.schema";

export type Review = z.infer<typeof BaseReviewSchema>;