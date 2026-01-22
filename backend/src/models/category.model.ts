import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const CategoryModel = model<ICategory>("Category", CategorySchema);