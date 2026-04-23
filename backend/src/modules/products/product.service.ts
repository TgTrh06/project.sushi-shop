import { ProductEntity, CreateProductDTO, UpdateProductDTO } from "./product.types";
import ProductRepository from "./product.repository";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/common/error.util";
import { PaginationResult, PaginationUtils } from "@/utils/common/pagination.util";
import { generateSlug } from "@/utils/common/slugify.util";
import CategoryRepository from "../categories/category.repository";

export default class ProductService {
  constructor(
    private readonly productRepo = new ProductRepository,
    private readonly categoryRepo = new CategoryRepository
  ) {};

  private async checkExist(name: string): Promise<void> {
    const result = await this.productRepo.existsByName(name);
    if (result) {
      throw new ConflictError("Product with this name already exists.");
    }
  }
  
  async getAllProducts(
    page: number,
    limit: number,
    offset: number,
  ): Promise<PaginationResult<ProductEntity>> {
    const { docs, total } = await this.productRepo.findPaginated(limit, offset);

    return PaginationUtils.format(docs, total, page, limit);
  }

  async getProductsByCategory(
    page: number,
    limit: number,
    offset: number,
    categorySlug: string
  ): Promise<PaginationResult<ProductEntity>> {
    const targetCategory = await this.categoryRepo.findBySlug(categorySlug);
    if (!targetCategory) {
      throw new NotFoundError("Category not found.");
    }

    const categoryId = targetCategory.id;
    const { docs, total } = await this.productRepo.findByCategory(limit, offset, categoryId);

    return PaginationUtils.format(docs, total, page, limit);
  }
  
  async getProductById(id: string): Promise<ProductEntity | null> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found.")
    }
    
    return product;
  }

  async getProductBySlug(slug: string): Promise<ProductEntity | null> {
    const product = await this.productRepo.findBySlug(slug);
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

    const newProduct = await this.productRepo.create(newData);

    return newProduct;
  } 

  async updateProduct(id: string, dto: UpdateProductDTO): Promise<ProductEntity> {
    const existingProduct = await this.productRepo.findById(id);
    if (!existingProduct) {
      throw new NotFoundError("Product not found.");
    }

    const updateData: any = { ...dto };
    if (dto.name && dto.name !== existingProduct.name) {
      await this.checkExist(dto.name);
      updateData.slug = generateSlug(dto.name);
    }

    const updatedProduct = await this.productRepo.update(id, dto);
    if (!updatedProduct) {
      throw new BadRequestError("Failed to update product.");
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<ProductEntity> {
    const existingProduct = await this.productRepo.findById(id);
    if (!existingProduct) {
      throw new NotFoundError("Product not found.");
    }

    const deletedProduct = await this.productRepo.delete(id);
    if (!deletedProduct) {
      throw new BadRequestError("Failed to delete product.");
    }

    return deletedProduct;
  }
}