export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_id?: string;
  gallery_ids?: string[];
  categoryId: string;
  isAvailable?: boolean;
  ratingSummary: { averageRating: number; totalReviews: number };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Review {
  id: string;
  productId: string;
  product: { slug: string; name: string };
  user: { id: string; name: string; email: string; avatar?: string };
  rating: number;
  comment: string;
  photo_ids?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  hasMore: boolean;
}
