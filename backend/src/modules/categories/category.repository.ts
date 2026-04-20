import { Model } from "mongoose";
import { CategoryModel } from "./category.model";
import {
  CategoryDocument,
  CategoryEntity,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "./category.types";
import { ProductDocument } from "../products/product.types";
import { ProductModel } from "../products/product.model";
import { generateSlug } from "@/utils/common/slugify.util";

export default class CategoryRepository {
  private categoryModel: Model<CategoryDocument>;
  private productModel: Model<ProductDocument>;

  constructor() {
    this.categoryModel = CategoryModel;
    this.productModel = ProductModel;
  }

  protected mapToEntity(doc: any): CategoryEntity {
    if (!doc) return null as any;
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    };
  }

  async create(dto: CreateCategoryDTO): Promise<CategoryEntity> {
    const doc = await this.categoryModel.create(dto);
    return this.mapToEntity(doc);
  }

  async findPaginated(
    limit: number,
    offset: number,
  ): Promise<{ docs: CategoryEntity[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.categoryModel
        .find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.categoryModel.countDocuments(),
    ]);
    return {
      docs: docs.map((doc) => this.mapToEntity(doc)),
      total,
    };
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const doc = await this.categoryModel.findOne({ slug }).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const doc = await this.categoryModel.findById(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(
    id: string,
    dto: UpdateCategoryDTO,
  ): Promise<CategoryEntity | null> {
    const doc = await this.categoryModel
      .findByIdAndUpdate(
        id, 
        { $set: dto }, 
        { returnDocument: "after" }
      )
      .lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<CategoryEntity | null> {
    const doc = await this.categoryModel.findByIdAndDelete(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async existsByName(name: string): Promise<boolean> {
    const slug = generateSlug(name);
    return !!(await this.categoryModel.exists({ slug }));
  }
}
