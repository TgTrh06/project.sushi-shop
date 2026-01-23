import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const CategoryModel = model<ICategory>("Category", CategorySchema);