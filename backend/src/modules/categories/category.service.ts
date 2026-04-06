import { PaginationResult, PaginationUtils } from "@/utils/common/pagination.utils";
import { ConflictError } from "../../utils/common/error.utils";
import CategoryRepository from "./category.repository";
import { CategoryEntity, CreateCategoryFormValues } from "./category.types";

export default class CategoryService {
  private repo = new CategoryRepository();

  async getAllCategories(
    page: number,
    limit: number,
    offset: number,
  ): Promise<PaginationResult<CategoryEntity>> {
    const { docs, total } = await this.repo.findPaginated(limit, offset);
    
    return PaginationUtils.format(docs, total, page, limit);
  }

  async createCategory(dto: CreateCategoryFormValues): Promise<CategoryEntity> {
    const existingCategory = await this.repo.exists(dto.name);
    if (existingCategory) {
      throw new ConflictError("Category already exists.");
    }

    return await this.repo.create(dto);
  }
}