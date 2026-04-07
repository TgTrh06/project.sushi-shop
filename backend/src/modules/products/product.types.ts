import { Types } from "mongoose";
import { z } from "zod";

// Business Entity
export interface ProductEntity {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: Types.ObjectId;
  isAvailable: boolean;
  stockQuantity: number;
  createdAt: Date;
}

// Database shape (Mongoose Document)
export interface ProductDocument extends Omit<ProductEntity, "id"> {}

// DTOs
export const CreateProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  description: z.string().max(250).optional(),
  categoryId: z.string().uuid(),
  isAvailable: z.boolean().optional(),
  stockQuantity: z.number().min(0)
});

export const UpdateProductSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  price: z.number().min(0).optional(),
  description: z.string().max(250).optional(),
  categoryId: z.string().optional(),
  isAvailable: z.boolean().optional(),
  stockQuantity: z.number().min(0).optional()
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;