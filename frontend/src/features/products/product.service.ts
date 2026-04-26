import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { Product, Review } from "./product.types";
import type { PaginatedResult } from "@/types/paginated.type";

export const productService = {
  async getProducts(page = 1, limit = 12, category?: string): Promise<PaginatedResult<Product>> {
    const endpoint = category && category !== "All"
      ? `/products/category/${category.toLowerCase()}`
      : "/products";

    const res = await api.get<ApiResponse<PaginatedResult<Product>>>(endpoint, {
      params: { page, limit },
    });

    return res.data.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const productResult = await api.get<ApiResponse<Product>>(`/products/${slug}`);

    const reviewsResult = await api.get<ApiResponse<Review[]>>(`/reviews/${productResult.data.data.id}/paginated`);

    const p = productResult.data.data;
    const r = reviewsResult.data.data;

    return {
      ...p,
      gallery: p.gallery?.length ? p.gallery : [], // Use image as fallback for gallery
      ingredients: p.ingredients?.length ? p.ingredients : ["Fresh Ingredients", "Japanese Style"],
      nutrition: [
        { label: "Calories", value: "300 kcal" },
        { label: "Protein", value: "20g" }
      ], // Mock nutrition if not in backend
    };
  }
};
