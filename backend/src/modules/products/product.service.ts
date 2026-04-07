import { ProductEntity, CreateProductDTO, UpdateProductDTO } from "./product.types";
import ProductRepository from "./product.repository";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/common/error.utils";

export default class ProductService {
  private repo = new ProductRepository();
  
  async getAllProducts(): Promise<ProductEntity[]> {
    return await this.repo.findAll();
  }

  async getProductsByCategory(categoryId: string): Promise<ProductEntity[]> {
    return await this.repo.findByCategory(categoryId);
  }
  
  async getProductById(id: string): Promise<ProductEntity | null> {
    const product = await this.repo.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found.")
    }
    
    return product;
  }
  
  /* ADMIN SERVICE */
  async createProduct(dto: CreateProductDTO): Promise<ProductEntity> {
    const existingProduct = await this.repo.findByName(dto.name);
    if (existingProduct) {
      throw new ConflictError("Product already exists.");
    }
    
    return await this.repo.create(dto);
  } 

  async updateProduct(id: string, dto: UpdateProductDTO): Promise<ProductEntity> {
    const existingProduct = await this.repo.findById(id);
    if (!existingProduct) {
      throw new NotFoundError("Product not found.");
    }

    const updatedProduct = await this.repo.update(id, dto);
    if (!updatedProduct) {
      throw new BadRequestError("Failed to update product.");
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const existingProduct = await this.repo.findById(id);
    if (!existingProduct) {
      throw new NotFoundError("Product not found.");
    }

    return await this.repo.delete(id);
  }
}