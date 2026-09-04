import z from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  image_id: z.string().optional(),
  gallery_ids: z.array(z.string()).optional(),
  categoryId: z.string(),
  isAvailable: z.boolean().default(true).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();
