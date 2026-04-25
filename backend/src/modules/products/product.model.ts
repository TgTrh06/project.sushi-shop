import { Schema, model, Types } from "mongoose";
import { ProductDocument } from "./product.types";

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  gallery: { type: [String], default: [] },
  description: { type: String },
  ingredients: { type: [String], default: [] },
  nutrition: {
    type: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    default: []
  },
  ratingSummary: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 }
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },
  isAvailable: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for category lookups
ProductSchema.index({ categoryId: 1 });

export const ProductModel = model<ProductDocument>("Product", ProductSchema);