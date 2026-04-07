import { z } from "zod";

// Base Schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-0-]+$/),
  description: z.string().max(250).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Entity shape - Use this for service layer and business logic
export type CategoryEntity = z.infer<typeof CategorySchema>;

// Database shape - Only use for Mongoose schema definition and database operations
export type CategoryDocument = Omit<CategoryEntity, "id">;

// DTO's Schemas
export const CreateCategorySchema = CategorySchema.pick({
  name: true,
  description: true,
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export const GetBySlugSchema = z.object({
  slug: z.string().min(1, "Slug cannot be empty.")
});

export const GetByIdSchema = z.object({
  id: z.string()
});

// DTOs
export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;