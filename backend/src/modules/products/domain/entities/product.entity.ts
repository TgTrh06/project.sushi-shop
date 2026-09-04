export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_id?: string;
  gallery_ids?: string[];
  categoryId: string;
  isAvailable?: boolean;
  ratingSummary: { averageRating: number; totalReviews: number };
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductInput = Omit<ProductEntity, "id" | "slug" | "ratingSummary" | "createdAt" | "updatedAt">;
export type UpdateProductInput = Partial<CreateProductInput>;
