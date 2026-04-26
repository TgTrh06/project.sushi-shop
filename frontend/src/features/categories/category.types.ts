import { z } from "zod";
import { BaseCategorySchema } from "@shared/schemas/category.schema";

export type Category = z.infer<typeof BaseCategorySchema>;
