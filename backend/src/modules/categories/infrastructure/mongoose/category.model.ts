import { Schema, model, type Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
}, { timestamps: true });

export const CategoryModel = model<CategoryDocument>("Category", schema);
