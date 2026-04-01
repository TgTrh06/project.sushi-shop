import { ConflictError } from "../../core/utils/common/error.utils";
import CategoryRepository from "./category.repository";
import { CategoryEntity, CreateCategoryDTO } from "./category.types";

export default class CategoryService {
  private repo = new CategoryRepository();

  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.repo.findAll();
  }

  async createCategory(dto: CreateCategoryDTO): Promise<CategoryEntity> {
    const existingCategory = await this.repo.findByName(dto.name)
    if (existingCategory) {
      throw new ConflictError("Category already exists.");
    }

    return await this.repo.create(dto);
  }
}