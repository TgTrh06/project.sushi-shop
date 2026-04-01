import BaseRepository from "../../repository";
import { 
  ProductEntity,
  CreateProductDTO,
  UpdateProductDTO 
} from "./product.types";
import { ProductModel } from "./product.model";

export default class ProductRepository extends BaseRepository <
  ProductEntity,
  CreateProductDTO,
  UpdateProductDTO
> {
  constructor() {
    super(ProductModel);
  }

  protected mapToEntity(doc: any): ProductEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      imageUrl: doc.imageUrl,
      categoryId: doc.categoryId,
      isAvailable: doc.isAvailable,
      stockQuantity: doc.stockQuantity,
      createdAt: doc.createdAt
    }
  }

  async findByCategory(categoryId: string): Promise<ProductEntity[]> {
    const doc = await this.model.find({ categoryId }).lean();
    return doc.map(this.mapToEntity);
  }
}