import { Schema, model, Document } from "mongoose";
import { CategoryDocument } from "./category.types";

const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export const CategoryModel = model<CategoryDocument>(
  "Category",
  CategorySchema,
);
