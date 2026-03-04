import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: Types.ObjectId;
  isAvailable: boolean;
  stockQuantity: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  isAvailable: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const ProductModel = model<IProduct>("Product", ProductSchema);