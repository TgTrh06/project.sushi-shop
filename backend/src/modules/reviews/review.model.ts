import { Schema, model } from "mongoose";
import type { ReviewDocument } from "./review.types";

const ReviewSchema = new Schema<ReviewDocument>({
  productId: { type: String, required: true },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// --- PHẦN TỐI ƯU HIỆU NĂNG ---

// Tạo một static method để tính toán trung bình ngay trong MongoDB (nhanh hơn JS rất nhiều)
ReviewSchema.statics.calcAverageRatings = async function (productId: string) {
  const stats = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const ProductModel = model("Product");

  if (stats.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      "ratingSummary.averageRating": Math.round(stats[0].avgRating * 10) / 10,
      "ratingSummary.totalReviews": stats[0].nRating,
    });
  } else {
    // Reset nếu không còn review nào
    await ProductModel.findByIdAndUpdate(productId, {
      "ratingSummary.averageRating": 0,
      "ratingSummary.totalReviews": 0,
    });
  }
};

// --- HOOKS ---

// 1. Sau khi Save (Create)
ReviewSchema.post("save", async function (this: any) {
  // 'this' trỏ về review vừa save
  await (this.constructor as any).calcAverageRatings(this.productId);
});

// 2. Trước khi Delete/Update (Dùng findOneAndDelete thay cho findByIdAndDelete)
// Lưu ý: findByIdAndDelete thực chất gọi findOneAndDelete
ReviewSchema.post("findOneAndDelete", async function (doc: any) {
  if (doc) {
    await (doc.constructor as any).calcAverageRatings(doc.productId);
  }
});

export const ReviewModel = model<ReviewDocument>("Review", ReviewSchema);