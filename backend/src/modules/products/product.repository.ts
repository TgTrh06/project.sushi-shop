import {
  ProductEntity,
  CreateProductDTO,
  UpdateProductDTO,
  ProductDocument,
} from "./product.types";
import { ProductModel } from "./product.model";
import { Model } from "mongoose";
import { ConflictError, NotFoundError } from "@/utils/common/error.utils";

export default class ProductRepository {
  private productModel: Model<ProductDocument>;

  constructor() {
    this.productModel = ProductModel;
  }

  protected mapToEntity(doc: any): ProductEntity {
    if (!doc) return null as any;
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      price: doc.price,
      imageUrl: doc.imageUrl,
      description: doc.description,
      categoryId: doc.categoryId.toString(),
      isAvailable: doc.isAvailable,
      stockQuantity: doc.stockQuantity,
      createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
    };
  }

  async create(dto: CreateProductDTO): Promise<ProductEntity> {
    const doc = await this.productModel.create(dto);
    return this.mapToEntity(doc);
  }

  async findPaginated(
    limit: number,
    offset: number,
  ): Promise<{ docs: ProductEntity[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.productModel
        .find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.productModel.countDocuments(),
    ]);
    return {
      docs: docs.map((doc) => this.mapToEntity(doc)),
      total,
    };
  }

  async findByCategory(
    limit: number,
    offset: number,
    categoryId: string
  ): Promise<{ docs: ProductEntity[], total: number }> {
    const [ docs, total ] = await Promise.all([
      this.productModel
        .find({ categoryId })
        .sort({ createAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.productModel.countDocuments(),
    ]);
    return {
      docs: docs.map((doc) => this.mapToEntity(doc)),
      total
    };
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const doc = await this.productModel.findOne({ slug }).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const doc = await this.productModel.findById(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(
    id: string,
    dto: UpdateProductDTO,
  ): Promise<ProductEntity | null> {
    const doc = await this.productModel
      .findByIdAndUpdate(id, { $set: dto }, { returnDocument: "after" })
      .lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<ProductEntity> {
    const hasProduct = await this.productModel.exists({ categoryId: id });
    if (hasProduct) {
      throw new ConflictError(
        "Cannot delete category with associated products.",
      );
    }

    const doc = await this.productModel.findByIdAndDelete(id).lean();
    if (!doc) {
      throw new NotFoundError("Category not found.");
    }

    return this.mapToEntity(doc);
  }

  async existsByName(name: string): Promise<boolean> {
    return !!(await this.productModel.exists({ name }));
  }
}
