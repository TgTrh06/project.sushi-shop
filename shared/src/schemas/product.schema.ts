import z from "zod";

// =========================================================
// BASE SCHEMAS FOR BOTH FRONTEND & BACKEND
// =========================================================

export const BaseProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  price: z.number().min(0),
  image_id: z.string().optional(), // Cloudinary public_id
  gallery_ids: z.array(z.string()).optional(), // Cloudinary public_ids
  categoryId: z.string(),
  isAvailable: z.boolean().default(true).optional(),

  ratingSummary: z.object({
    averageRating: z.number().default(0),
    totalReviews: z.number().default(0)
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})