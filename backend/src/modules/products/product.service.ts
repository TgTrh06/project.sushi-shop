import { ProductEntity, CreateProductDTO, UpdateProductDTO } from "./product.types";
import ProductRepository from "./product.repository";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/common/error.utils";
import { PaginationResult, PaginationUtils } from "@/utils/common/pagination.utils";
import { generateSlug } from "@/utils/common/slugify.utils";

export default class ProductService {
  constructor(private readonly repo = new ProductRepository) {};

  private async checkExist(name: string): Promise<void> {
    const result = await this.repo.existsByName(name);
    if (result) {
      throw new ConflictError("Product with this name already exists.");
    }
  }
  
  async getAllProducts(
    page: number,
    limit: number,
    offset: number,
  ): Promise<PaginationResult<ProductEntity>> {
    const { docs, total } = await this.repo.findPaginated(limit, offset);

    return PaginationUtils.format(docs, total, page, limit);
  }

  async getProductsByCategory(
    page: number,
    limit: number,
    offset: number,
    categoryId: string
  ): Promise<PaginationResult<ProductEntity>> {
    const { docs, total } = await this.repo.findByCategory(limit, offset, categoryId);

    return PaginationUtils.format(docs, total, page, limit);
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
    await this.checkExist(dto.name);

    const slug = generateSlug(dto.name);
    const newData = { ...dto, slug };

    const newProduct = await this.repo.create(newData);

    return newProduct;
  } 

  async updateProduct(id: string, dto: UpdateProductDTO): Promise<ProductEntity> {
    const existingProduct = await this.repo.findById(id);
    if (!existingProduct) {
      throw new NotFoundError("Product not found.");
    }

    const updateData: any = { ...dto };
    if (dto.name && dto.name !== existingProduct.name) {
      await this.checkExist(dto.name);
      updateData.slug = generateSlug(dto.name);
    }

    const updatedProduct = await this.repo.update(id, dto);
    if (!updatedProduct) {
      throw new BadRequestError("Failed to update product.");
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<ProductEntity> {
    const deletedProduct = await this.repo.findById(id);
    if (!deletedProduct) {
      throw new NotFoundError("Product not found.");
    }

    return deletedProduct;
  }
}