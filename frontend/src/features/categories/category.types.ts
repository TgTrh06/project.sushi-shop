import { z } from "zod";
import { BaseCategorySchema } from "@itsu-sushi/shared/schemas/category.schema";

export type Category = z.infer<typeof BaseCategorySchema>;
