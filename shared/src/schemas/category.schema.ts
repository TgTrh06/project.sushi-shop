import z from "zod";

// =========================================================
// BASE SCHEMAS FOR BOTH FRONTEND & BACKEND
// =========================================================

export const BaseCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().max(250).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
