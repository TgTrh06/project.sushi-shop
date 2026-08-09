import type z from "zod";
import type { BaseReviewSchema } from "@itsu-sushi/shared/schemas/review.schema";

export type Review = z.infer<typeof BaseReviewSchema>;
