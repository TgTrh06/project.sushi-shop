import { Types, type Model } from "mongoose";
import { ReviewModel, type ReviewDocument } from "./review.model";
import { ProductModel } from "@/modules/products/infrastructure/persistence/mongoose/product.model";
import type { ReviewRepository } from "../../../domain/ports/review-repository.port";
import type { ReviewEntity, CreateReviewInput } from "../../../domain/entities/review.entity";

export class MongooseReviewRepository implements ReviewRepository {
  constructor(private readonly model: Model<ReviewDocument> = ReviewModel) {}
  private map(doc: Record<string, any>): ReviewEntity { return { id: String(doc._id), productId: String(doc.productId), product: { slug: doc.productInfo?.slug ?? "", name: doc.productInfo?.name ?? "" }, user: { id: String(doc.userInfo?._id ?? doc.userId?._id ?? doc.userId ?? ""), name: doc.userInfo?.username ?? doc.userId?.username ?? "", email: doc.userInfo?.email ?? doc.userId?.email ?? "", avatar: doc.userInfo?.avatar ?? doc.userId?.avatar }, rating: doc.rating, comment: doc.comment, photo_ids: doc.photo_ids ?? [], createdAt: new Date(doc.createdAt), updatedAt: new Date(doc.updatedAt) }; }
  async create(input: CreateReviewInput) { const doc = await this.model.create({ ...input, userId: new Types.ObjectId(input.userId) }); await this.syncRating(input.productId); return this.findById(String(doc._id)) as Promise<ReviewEntity>; }
  async findById(id: string) { const doc = await this.model.findById(id).populate("userId", "username email avatar").lean(); return doc ? this.map(doc) : null; }
  async delete(id: string) { const doc = await this.model.findByIdAndDelete(id).lean(); if (doc) await this.syncRating(String(doc.productId)); return doc ? this.findMappedByRaw(doc) : null; }
  private async findMappedByRaw(doc: Record<string, any>) { const populated = await this.model.findById(doc._id).populate("userId", "username email avatar").lean(); return this.map(populated ?? doc); }
  async findByProduct(productId: string) { const docs = await this.model.find({ productId }).populate("userId", "username email avatar").sort({ createdAt: -1 }).lean(); return docs.map((doc) => this.map(doc)); }
  async findByProductPaginated(productId: string, skip: number, limit: number) { const [docs, total] = await Promise.all([this.model.find({ productId }).populate("userId", "username email avatar").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), this.model.countDocuments({ productId })]); return { data: docs.map((doc) => this.map(doc)), total }; }
  async findAllPaginated(skip: number, limit: number, email?: string, date?: string, sortOrder: "asc" | "desc" = "desc") {
    const match: Record<string, unknown> = {};
    if (date) { const start = new Date(`${date}T00:00:00.000Z`); const end = new Date(`${date}T23:59:59.999Z`); match.createdAt = { $gte: start, $lte: end }; }
    const pipeline: any[] = [
      { $match: match },
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userInfo" } },
      { $unwind: "$userInfo" },
      { $lookup: { from: "products", let: { pid: { $toObjectId: "$productId" } }, pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$pid"] } } }, { $project: { slug: 1, name: 1 } }], as: "productInfo" } },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
    ];
    if (email) pipeline.push({ $match: { "userInfo.email": { $regex: email, $options: "i" } } });
    const [count, docs] = await Promise.all([this.model.aggregate([...pipeline, { $count: "total" }]), this.model.aggregate([...pipeline, { $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } }, { $skip: skip }, { $limit: limit }])]);
    return { data: docs.map((doc) => this.map(doc)), total: count[0]?.total ?? 0 };
  }
  async calculateRating(productId: string) { const [row] = await this.model.aggregate([{ $match: { productId } }, { $group: { _id: "$productId", totalReviews: { $sum: 1 }, averageRating: { $avg: "$rating" } } }]); return { totalReviews: row?.totalReviews ?? 0, averageRating: row ? Math.round(row.averageRating * 10) / 10 : 0 }; }
  private async syncRating(productId: string) { await ProductModel.findByIdAndUpdate(productId, { $set: { ratingSummary: await this.calculateRating(productId) } }); }
}
