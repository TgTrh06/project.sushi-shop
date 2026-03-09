import { Schema, model, Types } from "mongoose";
import { ProductDocument } from "./product.types";

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: Types.ObjectId, ref: "Category", required: true },
  isAvailable: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const ProductModel = model<ProductDocument>("Product", ProductSchema);
