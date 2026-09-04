import { Schema, model, type Document, Types } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  price: number;
  image_id?: string;
  gallery_ids: string[];
  categoryId: Types.ObjectId;
  isAvailable: boolean;
  ratingSummary: { averageRating: number; totalReviews: number };
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ProductDocument>({
  name: { type: String, required: true }, slug: { type: String, required: true, unique: true, index: true },
  price: { type: Number, required: true, min: 0 }, image_id: String, gallery_ids: { type: [String], default: [] },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true }, isAvailable: { type: Boolean, default: true },
  ratingSummary: { averageRating: { type: Number, default: 0 }, totalReviews: { type: Number, default: 0 } },
}, { timestamps: true });
schema.index({ categoryId: 1 });
export const ProductModel = model<ProductDocument>("Product", schema);
