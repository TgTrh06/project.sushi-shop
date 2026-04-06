import { z } from "zod";

// Business Entity
export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// Database shape - Only use for Mongoose schema definition and database operations
export interface CategoryDocument extends Omit<CategoryEntity, "id"> {}

// DTOs
export const CreateCategoryDTO = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(250).optional()
});

export const UpdateCategoryDTO = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(250).optional()
});

export type CreateCategoryFormValues = z.infer<typeof CreateCategoryDTO>;
export type UpdateCategoryFormValues = z.infer<typeof UpdateCategoryDTO>;