import { ConflictError, NotFoundError } from "@/core/errors";
import { Pagination } from "@/core/http/pagination";
import { generateSlug } from "@/core/domain/slugify";
import type { CategoryRepository } from "../../domain/ports/category-repository.port";
import type { CreateCategoryInput, UpdateCategoryInput } from "../../domain/entities/category.entity";

export class ListCategoriesUseCase {
  constructor(private readonly categories: CategoryRepository) {}
  async execute(page: number, limit: number) { const result = await this.categories.list((page - 1) * limit, limit); return Pagination.result(result.data, result.total, page, limit); }
}

export class GetCategoryBySlugUseCase {
  constructor(private readonly categories: CategoryRepository) {}
  async execute(slug: string) { const category = await this.categories.findBySlug(slug); if (!category) throw new NotFoundError("Category not found"); return category; }
}

export class CreateCategoryUseCase {
  constructor(private readonly categories: CategoryRepository) {}
  async execute(input: CreateCategoryInput) { const slug = generateSlug(input.name); if (await this.categories.existsBySlug(slug)) throw new ConflictError("Category with this name already exists."); return this.categories.create({ ...input, slug }); }
}

export class UpdateCategoryUseCase {
  constructor(private readonly categories: CategoryRepository) {}
  async execute(id: string, input: UpdateCategoryInput) { const current = await this.categories.findById(id); if (!current) throw new NotFoundError("Category not found."); const slug = input.name && input.name !== current.name ? generateSlug(input.name) : undefined; if (slug && await this.categories.existsBySlug(slug, id)) throw new ConflictError("Category with this name already exists."); const result = await this.categories.update(id, { ...input, ...(slug ? { slug } : {}) }); if (!result) throw new NotFoundError("Category not found."); return result; }
}

export class DeleteCategoryUseCase {
  constructor(private readonly categories: CategoryRepository) {}
  async execute(id: string) { const result = await this.categories.delete(id); if (!result) throw new NotFoundError("Category not found."); return result; }
}
