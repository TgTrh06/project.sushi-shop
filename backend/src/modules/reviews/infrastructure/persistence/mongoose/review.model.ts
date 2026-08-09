import { Schema, model, type Document, Types } from "mongoose";

export interface ReviewDocument extends Document {
  productId: string;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  photo_ids: string[];
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ReviewDocument>({
  productId: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
  photo_ids: { type: [String], default: [] },
}, { timestamps: true });

export const ReviewModel = model<ReviewDocument>("Review", schema);
