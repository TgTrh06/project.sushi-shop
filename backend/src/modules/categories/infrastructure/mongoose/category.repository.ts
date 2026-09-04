import type { Model } from "mongoose";
import { CategoryModel, type CategoryDocument } from "./category.model";
import type { CategoryRepository } from "../../domain/ports/category-repository.port";
import type { CategoryEntity, CreateCategoryInput, UpdateCategoryInput } from "../../domain/entities/category.entity";

export class MongooseCategoryRepository implements CategoryRepository {
  constructor(private readonly model: Model<CategoryDocument> = CategoryModel) {}
  private map(doc: CategoryDocument | Record<string, any>): CategoryEntity {
    return { id: String(doc._id), name: doc.name, slug: doc.slug, description: doc.description, createdAt: new Date(doc.createdAt), updatedAt: new Date(doc.updatedAt) };
  }
  async create(input: CreateCategoryInput & { slug: string }) { return this.map(await this.model.create(input)); }
  async findById(id: string) { const doc = await this.model.findById(id).lean(); return doc ? this.map(doc) : null; }
  async findBySlug(slug: string) { const doc = await this.model.findOne({ slug }).lean(); return doc ? this.map(doc) : null; }
  async list(skip: number, limit: number) { const [docs, total] = await Promise.all([this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), this.model.countDocuments()]); return { data: docs.map((doc) => this.map(doc)), total }; }
  async update(id: string, input: UpdateCategoryInput & { slug?: string }) { const doc = await this.model.findByIdAndUpdate(id, { $set: input }, { returnDocument: "after", runValidators: true }).lean(); return doc ? this.map(doc) : null; }
  async delete(id: string) { const doc = await this.model.findByIdAndDelete(id).lean(); return doc ? this.map(doc) : null; }
  async existsBySlug(slug: string, excludingId?: string) { return Boolean(await this.model.exists({ slug, ...(excludingId ? { _id: { $ne: excludingId } } : {}) })); }
}
