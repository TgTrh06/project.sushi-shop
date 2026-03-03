export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// DTOs for creating and updating categories
export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

export interface CategoryDocument extends Omit<Category, "id"> {}