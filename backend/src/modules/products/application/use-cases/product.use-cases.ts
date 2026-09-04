import { BadRequestError, ConflictError, NotFoundError } from "@/core/errors";
import { Pagination } from "@/core/http/pagination";
import type { FileStorage } from "@/core/ports/file-storage.port";
import { generateSlug } from "@/core/domain/slugify";
import type { CategoryRepository } from "@/modules/categories/domain/ports/category-repository.port";
import type { ProductRepository } from "../../domain/ports/product-repository.port";
import type { CreateProductInput, UpdateProductInput } from "../../domain/entities/product.entity";

export class ListProductsUseCase {
  constructor(private readonly products: ProductRepository, private readonly categories: CategoryRepository) {}
  async execute(page: number, limit: number, categorySlug?: string) { let result; if (categorySlug) { const category = await this.categories.findBySlug(categorySlug); if (!category) throw new NotFoundError("Category not found."); result = await this.products.findByCategory(category.id, (page - 1) * limit, limit); } else result = await this.products.list((page - 1) * limit, limit); return Pagination.result(result.data, result.total, page, limit); }
}

export class GetProductUseCase {
  constructor(private readonly products: ProductRepository) {}
  async bySlug(slug: string) { const result = await this.products.findBySlug(slug); if (!result) throw new NotFoundError("Product not found."); return result; }
  async byId(id: string) { const result = await this.products.findById(id); if (!result) throw new NotFoundError("Product not found."); return result; }
}

export class CreateProductUseCase {
  constructor(private readonly products: ProductRepository) {}
  async execute(input: CreateProductInput) { const slug = generateSlug(input.name); if (await this.products.existsBySlug(slug)) throw new ConflictError("Product with this name already exists."); return this.products.create({ ...input, slug }); }
}

export class UpdateProductUseCase {
  constructor(private readonly products: ProductRepository, private readonly storage: FileStorage) {}
  async execute(id: string, input: UpdateProductInput) { const current = await this.products.findById(id); if (!current) throw new NotFoundError("Product not found."); const slug = input.name && input.name !== current.name ? generateSlug(input.name) : undefined; if (slug && await this.products.existsBySlug(slug, id)) throw new ConflictError("Product with this name already exists."); const removed = [...(current.image_id && input.image_id && current.image_id !== input.image_id ? [current.image_id] : []), ...(input.gallery_ids ? (current.gallery_ids ?? []).filter((image) => !input.gallery_ids!.includes(image)) : [])]; if (removed.length) await this.storage.deleteMany(removed).catch(() => undefined); const result = await this.products.update(id, { ...input, ...(slug ? { slug } : {}) }); if (!result) throw new BadRequestError("Failed to update product."); return result; }
}

export class DeleteProductUseCase {
  constructor(private readonly products: ProductRepository, private readonly storage: FileStorage) {}
  async execute(id: string) { const current = await this.products.findById(id); if (!current) throw new NotFoundError("Product not found."); const ids = [current.image_id, ...(current.gallery_ids ?? [])].filter((value): value is string => Boolean(value)); if (ids.length) await this.storage.deleteMany(ids).catch(() => undefined); const result = await this.products.delete(id); if (!result) throw new NotFoundError("Product not found."); return result; }
}
