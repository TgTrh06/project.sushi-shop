// Business Entity
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// DTOs
export interface CreateCategoryDTO extends Pick<Category, "name" | "description"> {}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

// Database shape - Only use for Mongoose schema definition and database operations
export interface CategoryDocument extends Omit<Category, "id"> {}