export interface ReviewEntity {
  id: string;
  productId: string;
  user: { id: string; name: string; email: string; avatar?: string };
  product: { slug: string; name: string };
  rating: number;
  comment: string;
  photo_ids?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewInput { productId: string; rating: number; comment: string; photo_ids?: string[]; userId: string; }
