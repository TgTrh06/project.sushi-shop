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
export const CreateProductDTO = z.object({
  name: z.string().min(2).max(100),
  price: z.number().min(0),
  description: z.string().max(250).optional(),
  categoryId: z.string().uuid(),
  isAvailable: z.boolean().optional(),
  stockQuantity: z.number().min(0)
});

export const UpdateProductDTO = z.object({
  name: z.string().min(2).max(100).optional(),
  price: z.number().min(0).optional(),
  description: z.string().max(250).optional(),
  categoryId: z.string().uuid().optional(),
  isAvailable: z.boolean().optional(),
  stockQuantity: z.number().min(0).optional()
});

export type CreateProductInput = z.infer<typeof CreateProductDTO>;
export type UpdateProductInput = z.infer<typeof UpdateProductDTO>;