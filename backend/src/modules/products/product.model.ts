import { Schema, model, Types } from "mongoose";
import { ProductDocument } from "./product.types";

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  image_id: { type: String, default: null }, // Cloudinary public_id for featured image
  gallery_ids: { type: [String], default: [] }, // Cloudinary public_ids for gallery images
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for category lookups
ProductSchema.index({ categoryId: 1 });

export const ProductModel = model<ProductDocument>("Product", ProductSchema);