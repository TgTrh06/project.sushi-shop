import BaseRepository from "../../core/base.repository";
import { CategoryModel } from "./category.model";
import { 
  CategoryEntity,
  CreateCategoryDTO,
  UpdateCategoryDTO
} from "./category.types";

export default class CategoryRepository extends BaseRepository<
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