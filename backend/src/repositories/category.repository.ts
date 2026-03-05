import { BaseRepository } from "./base.repository";
import { CategoryModel } from "../models/category/category.model";
import { 
  CategoryEntity,
  CreateCategoryDTO,
  UpdateCategoryDTO
} from "../models/category/category.types";

export class CategoryRepository extends BaseRepository<
  CategoryEntity,
  CreateCategoryDTO,
  UpdateCategoryDTO
> {
  constructor() {
    super(CategoryModel);
  }

  protected mapToEntity(doc: any): CategoryEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
    };
  }
}