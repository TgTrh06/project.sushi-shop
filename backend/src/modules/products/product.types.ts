import { z } from "zod";    
import { ProductSchema } from "@shared/schemas/product.schema";

// DTO's Schemas
export const CreateProductSchema = ProductSchema.pick({
  name: true,
  price: true,
  imageUrl: true,
  description: true,
  categoryId: true,
  isAvailable: true,
  stockQuantity: true,
});

export const UpdateProductSchema = ProductSchema.partial();

// Entity shape - Use this for service layer and business logic
export type ProductEntity = z.infer<typeof ProductSchema>

// Database shape - Only use for Mongoose schema definition and database operations
export type ProductDocument = Omit<ProductEntity, "id">;

// Input for controller usages
export type CreateProductInput = z.input<typeof CreateProductSchema>
export type UpdateProductInput = z.input<typeof UpdateProductSchema>

// Infer/Output for service usages
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;

// Request types
export type GetByIdParams = { id: string };
export type GetBySlugParams = { slug: string };