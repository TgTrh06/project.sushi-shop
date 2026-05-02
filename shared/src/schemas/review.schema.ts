import { z } from "zod";

// =========================================================
// BASE SCHEMAS FOR BOTH FRONTEND & BACKEND
// =========================================================

export const BaseReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
  }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateReviewSchema = BaseReviewSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});