import type { Model } from "mongoose";
import { ProductModel, type ProductDocument } from "./product.model";
import type { ProductRepository } from "../../domain/ports/product-repository.port";
import type { ProductEntity, CreateProductInput, UpdateProductInput } from "../../domain/entities/product.entity";

export class MongooseProductRepository implements ProductRepository {
  constructor(private readonly model: Model<ProductDocument> = ProductModel) {}
  private map(doc: ProductDocument | Record<string, any>): ProductEntity {
    return { id: String(doc._id), name: doc.name, slug: doc.slug, price: doc.price, image_id: doc.image_id ?? undefined, gallery_ids: doc.gallery_ids ?? [], categoryId: String(doc.categoryId?._id ?? doc.categoryId), isAvailable: doc.isAvailable, ratingSummary: { averageRating: doc.ratingSummary?.averageRating ?? 0, totalReviews: doc.ratingSummary?.totalReviews ?? 0 }, createdAt: new Date(doc.createdAt), updatedAt: new Date(doc.updatedAt) };
  }
  async create(input: CreateProductInput & { slug: string }) { return this.map(await this.model.create(input)); }
  async findById(id: string) { const doc = await this.model.findById(id).populate("categoryId").lean(); return doc ? this.map(doc) : null; }
  async findBySlug(slug: string) { const doc = await this.model.findOne({ slug }).populate("categoryId").lean(); return doc ? this.map(doc) : null; }
  private async listByFilter(filter: Record<string, unknown>, skip: number, limit: number) { const [docs, total] = await Promise.all([this.model.find(filter).populate("categoryId").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), this.model.countDocuments(filter)]); return { data: docs.map((doc) => this.map(doc)), total }; }
  list(skip: number, limit: number) { return this.listByFilter({}, skip, limit); }
  findByCategory(categoryId: string, skip: number, limit: number) { return this.listByFilter({ categoryId }, skip, limit); }
  async update(id: string, input: UpdateProductInput & { slug?: string }) { const doc = await this.model.findByIdAndUpdate(id, { $set: input }, { returnDocument: "after", runValidators: true }).lean(); return doc ? this.map(doc) : null; }
  async delete(id: string) { const doc = await this.model.findByIdAndDelete(id).lean(); return doc ? this.map(doc) : null; }
  async existsBySlug(slug: string, excludingId?: string) { return Boolean(await this.model.exists({ slug, ...(excludingId ? { _id: { $ne: excludingId } } : {}) })); }
  async updateRatingSummary(productId: string, summary: { averageRating: number; totalReviews: number }) { await this.model.findByIdAndUpdate(productId, { $set: { ratingSummary: summary } }); }
}
