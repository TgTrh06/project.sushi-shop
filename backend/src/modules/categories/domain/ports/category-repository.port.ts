import type { CategoryEntity, CreateCategoryInput, UpdateCategoryInput } from "../entities/category.entity";

export interface CategoryRepository {
  create(input: CreateCategoryInput & { slug: string }): Promise<CategoryEntity>;
  findById(id: string): Promise<CategoryEntity | null>;
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  list(skip: number, limit: number): Promise<{ data: CategoryEntity[]; total: number }>;
  update(id: string, input: UpdateCategoryInput & { slug?: string }): Promise<CategoryEntity | null>;
  delete(id: string): Promise<CategoryEntity | null>;
  existsBySlug(slug: string, excludingId?: string): Promise<boolean>;
}
