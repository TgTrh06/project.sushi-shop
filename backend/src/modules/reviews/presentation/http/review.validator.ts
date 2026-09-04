import z from "zod";

export const CreateReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
  photo_ids: z.array(z.string().trim().min(1)).max(5).optional(),
});
