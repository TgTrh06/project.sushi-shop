import { Schema, model, Document, Types } from "mongoose";
import { ICategory } from "./category.model";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: Types.ObjectId | ICategory;
  inStock: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const ProductModel = model<IProduct>("Product", ProductSchema);