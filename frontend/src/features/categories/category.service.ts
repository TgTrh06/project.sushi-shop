import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { Category } from "./category.types";
import type { PaginatedResult } from "@/types/paginated.type";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const res = await api.get<ApiResponse<PaginatedResult<Category>>>("/categories");
    return res.data.data.data;
  }
};
