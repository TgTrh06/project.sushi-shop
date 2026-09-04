export interface CategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput { name: string; description?: string; }
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
