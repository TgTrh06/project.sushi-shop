import { z } from "zod";    
import { BaseProductSchema } from "@shared/schemas/product.schema";

// DTO's Schemas
export const CreateProductSchema = BaseProductSchema.pick({
  name: true,
  price: true,
  image_id: true,
  gallery_ids: true,
  description: true,
  categoryId: true,
  isAvailable: true,
});

export const UpdateProductSchema = BaseProductSchema.omit({
  id: true,
  ratingSummary: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// Entity shape - Use this for service layer and business logic
export type ProductEntity = z.infer<typeof BaseProductSchema>

// Database shape - Only use for Mongoose schema definition and database operations
export type ProductDocument = Omit<ProductEntity, "id" | "categoryId"> & {
  categoryId: any;
};

// Input for controller usages
export type CreateProductInput = z.input<typeof CreateProductSchema>
export type UpdateProductInput = z.input<typeof UpdateProductSchema>

// Infer/Output for service usages
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;