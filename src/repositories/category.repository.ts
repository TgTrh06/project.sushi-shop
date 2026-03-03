import { BaseRepository } from "./base.repository";
import { CategoryModel } from "../models/category/category.model";
import { 
  ICategory,
  CreateCategoryDTO,
  UpdateCategoryDTO
} from "../models/category/category.types";

export class CategoryRepository extends BaseRepository<
  ICategory,
  CreateCategoryDTO,
  UpdateCategoryDTO
> {
  constructor() {
    super(CategoryModel);
  }

  protected mapToEntity(doc: any): ICategory {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
    };
  }
}