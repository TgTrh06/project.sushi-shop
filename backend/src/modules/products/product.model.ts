import { Schema, model, Types } from "mongoose";
import { ProductDocument } from "./product.types";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },
  isAvailable: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const ProductModel = model<ProductDocument>("Product", ProductSchema);