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
    email: z.string().email(),
    avatar: z.string().optional(),
  }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
  photo_ids: z.array(z.string()).optional(), // Cloudinary public_ids
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateReviewSchema = BaseReviewSchema.omit({
  id: true,
  user: true,      // userId is extracted from auth token on the backend
  createdAt: true,
  updatedAt: true,
});