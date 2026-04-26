import z from "zod";

// =========================================================
// BASE SCHEMAS FOR BOTH FRONTEND & BACKEND
// =========================================================

export const BaseProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  image: z.string().optional(),
  price: z.number().min(0),
  gallery: z.array(z.string()).optional(),
  description: z.string().max(250).optional(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  isAvailable: z.boolean().default(true).optional(),
  stockQuantity: z.number().min(0).default(0),

  ingredients: z.array(z.string()),

  nutrition: z.array(z.object({
    label: z.string(),
    value: z.string()
  })),

  ratingSummary: z.object({
    averageRating: z.number().default(0),
    totalReviews: z.number().default(0)
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
})