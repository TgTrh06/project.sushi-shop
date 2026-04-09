import z from "zod";

// =========================================================
// BASE SCHEMAS FOR BOTH FRONTEND & BACKEND
// =========================================================

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  description: z.string().max(250).optional(),
  categoryId: z.string(),
  isAvailable: z.boolean().default(true),
  stockQuantity: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})