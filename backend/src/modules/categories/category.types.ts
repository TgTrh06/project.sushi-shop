import { z } from "zod";
import { CategorySchema } from "@shared/schemas/category.schema";

// DTO's Schemas
export const CreateCategorySchema = CategorySchema.pick({
  name: true,
  description: true,
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// Entity shape - Use this for service layer and business logic
export type CategoryEntity = z.infer<typeof CategorySchema>;

// Database shape - Only use for Mongoose schema definition and database operations
export type CategoryDocument = Omit<CategoryEntity, "id">;

// Input for controller usages
export type CreateCategoryInput = z.input<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.input<typeof UpdateCategorySchema>;

// Infer/output for service usages
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;