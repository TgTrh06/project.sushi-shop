import { Schema, model } from "mongoose";
import { CategoryDocument } from "./category.types";

const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true},
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const CategoryModel = model<CategoryDocument>("Category", CategorySchema);