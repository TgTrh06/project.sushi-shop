import type { ProductEntity, CreateProductInput, UpdateProductInput } from "../entities/product.entity";

export interface ProductRepository {
  create(input: CreateProductInput & { slug: string }): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findByCategory(categoryId: string, skip: number, limit: number): Promise<{ data: ProductEntity[]; total: number }>;
  list(skip: number, limit: number): Promise<{ data: ProductEntity[]; total: number }>;
  update(id: string, input: UpdateProductInput & { slug?: string }): Promise<ProductEntity | null>;
  delete(id: string): Promise<ProductEntity | null>;
  existsBySlug(slug: string, excludingId?: string): Promise<boolean>;
  updateRatingSummary(productId: string, summary: { averageRating: number; totalReviews: number }): Promise<void>;
}
