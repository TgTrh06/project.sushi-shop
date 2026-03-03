// Interface for Category entity
export interface ICategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// DTOs for creating and updating categories
export interface CreateCategoryDTO extends Pick<ICategory, "name" | "description"> {}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

// Only use CategoryDocument for Mongoose schema definition and database operations
export interface CategoryDocument extends Omit<ICategory, "id"> {}