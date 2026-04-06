import { ConflictError } from "../../utils/common/error.utils";
import CategoryRepository from "./category.repository";
import { CategoryEntity, CreateCategoryInput } from "./category.types";

export default class CategoryService {
  private repo = new CategoryRepository();

  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.repo.findAll();
  }

  async createCategory(dto: CreateCategoryInput): Promise<CategoryEntity> {
    const existingCategory = await this.repo.findByName(dto.name)
    if (existingCategory) {
      throw new ConflictError("Category already exists.");
    }

    return await this.repo.create(dto);
  }
}