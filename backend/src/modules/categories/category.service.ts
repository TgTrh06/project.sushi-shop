import {
  PaginationResult,
  PaginationUtils,
} from "@/utils/common/pagination.utils";
import { BadRequestError, ConflictError, NotFoundError } from "@/utils/common/error.utils";
import CategoryRepository from "./category.repository";
import { CategoryEntity, CreateCategoryDTO } from "./category.types";
import { generateSlug } from "@/utils/common/slugify.utils";

export default class CategoryService {
  private repo = new CategoryRepository();

  private async checkExist(name: string): Promise<void> {
    const result = await this.repo.existsByName(name);
    if (result) {
      throw new ConflictError("Category with this name already exists.");
    }
  };

  async getAllCategories(
    page: number,
    limit: number,
    offset: number,
  ): Promise<PaginationResult<CategoryEntity>> {
    const { docs, total } = await this.repo.findPaginated(limit, offset);

    return PaginationUtils.format(docs, total, page, limit);
  };

  async getOneBySlug(slug: string): Promise<CategoryEntity | null> {
    if (!slug) {
      throw new BadRequestError("Slug is requied.");
    }
    
    const result = await this.repo.findBySlug(slug);
    
    if (!result) {
      throw new NotFoundError(`Category with slug '${slug}' not found.`);
    }

    return result;
  }

  async createCategory(dto: CreateCategoryDTO): Promise<CategoryEntity> {
    await this.checkExist(dto.name);

    const slug = generateSlug(dto.name);
    const newData = ({ ...dto, slug });

    const newCategory = await this.repo.create(newData);

    return newCategory;
  };

  async updateCategory(
    id: string,
    dto: Partial<CreateCategoryDTO>,
  ): Promise<CategoryEntity> {
    const existingCategory = await this.repo.findById(id);
    if (!existingCategory) {
      throw new NotFoundError("Category not found.");
    }

    const updateData: any = { ...dto };
    if (dto.name && dto.name !== existingCategory.name) {
      await this.checkExist(dto.name);
      updateData.slug = generateSlug(dto.name);
    }

    const updatedCategory = await this.repo.update(id, updateData);
    if (!updatedCategory) {
      throw new NotFoundError("Update failed.");
    }

    return updatedCategory;
  };

  async deleteCategory(id: string): Promise<CategoryEntity> {
    const deletedCategory = await this.repo.delete(id);
    if (!deletedCategory) {
      throw new NotFoundError("Category not found.");
    }

    return deletedCategory;
  };
}
