import z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(250).optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();
