import { Model } from "mongoose";
import { CategoryModel } from "./category.model";
import {
  CategoryDocument,
  CategoryEntity,
  CreateCategoryFormValues,
  UpdateCategoryFormValues,
} from "./category.types";

export default class CategoryRepository {
  private model: Model<CategoryDocument>;

  constructor() {
    this.model = CategoryModel;
  }

  protected mapToEntity(doc: any): CategoryEntity {
    if (!doc) return null as any;
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
    };
  }

  async create(dto: CreateCategoryFormValues): Promise<CategoryEntity> {
    const doc = await this.model.create(dto);
    return this.mapToEntity(doc);
  }

  async findPaginated(
    limit: number,
    offset: number,
  ): Promise<{ docs: CategoryEntity[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model
        .find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.model.countDocuments(),
    ]);
    return {
      docs: docs.map((doc) => this.mapToEntity(doc)),
      total,
    };
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(
    id: string,
    dto: UpdateCategoryFormValues,
  ): Promise<CategoryEntity | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { returnDocument: "after" })
      .lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async exists(name: string): Promise<boolean> {
    return !!(await this.model.exists({ name }));
  }
}
