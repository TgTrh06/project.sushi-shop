import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { PaginatedResult } from "@/types/paginated.type";
import type {
  AdminUser,
  AdminCategory,
  AdminProduct,
  AdminBooking,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateProductPayload,
  UpdateProductPayload,
  SystemStats,
  BookingStatus,
} from "./admin.types";

// ─── Dashboard ─────────────────────────────────────────
export const adminService = {
  async getStats(): Promise<SystemStats> {
    const res = await api.get<ApiResponse<SystemStats>>("/admin/stats");
    return res.data.data;
  },

  // ─── Uploads ───────────────────────────────────────────
  async uploadImage(file: File): Promise<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post<ApiResponse<{ url: string; public_id: string }>>("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async uploadGallery(files: File[] | FileList): Promise<{ urls: string[]; public_ids: string[] }> {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    const res = await api.post<ApiResponse<{ urls: string[]; public_ids: string[] }>>("/upload/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async uploadUserAvatar(file: File): Promise<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await api.post<ApiResponse<{ url: string; public_id: string }>>("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async uploadReviewPhotos(files: File[] | FileList): Promise<{ urls: string[]; public_ids: string[] }> {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("photos", file));
    const res = await api.post<ApiResponse<{ urls: string[]; public_ids: string[] }>>("/upload/review-photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async deleteImage(public_id: string): Promise<void> {
    await api.delete(`/upload/image/${public_id}`);
  },

  async deleteImages(public_ids: string[]): Promise<void> {
    await api.post("/upload/delete-multiple", { public_ids });
  },

  // ─── Users ───────────────────────────────────────────
  async getUsers(page = 1, limit = 10): Promise<PaginatedResult<AdminUser>> {
    const res = await api.get<ApiResponse<PaginatedResult<AdminUser>>>("/admin/users", {
      params: { page, limit },
    });
    return res.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/${id}`);
  },

  // ─── Categories ──────────────────────────────────────
  async getCategories(page = 1, limit = 20): Promise<PaginatedResult<AdminCategory>> {
    const res = await api.get<ApiResponse<PaginatedResult<AdminCategory>>>("/categories", {
      params: { page, limit },
    });
    return res.data.data;
  },

  async createCategory(payload: CreateCategoryPayload): Promise<AdminCategory> {
    const res = await api.post<ApiResponse<AdminCategory>>("/categories", payload);
    return res.data.data;
  },

  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<AdminCategory> {
    const res = await api.put<ApiResponse<AdminCategory>>(`/categories/${id}`, payload);
    return res.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  // ─── Products ─────────────────────────────────────────
  async getProducts(page = 1, limit = 10): Promise<PaginatedResult<AdminProduct>> {
    const res = await api.get<ApiResponse<PaginatedResult<AdminProduct>>>("/products", {
      params: { page, limit },
    });
    return res.data.data;
  },

  async createProduct(payload: CreateProductPayload): Promise<AdminProduct> {
    const res = await api.post<ApiResponse<AdminProduct>>("/products", payload);
    return res.data.data;
  },

  async updateProduct(id: string, payload: UpdateProductPayload): Promise<AdminProduct> {
    const res = await api.put<ApiResponse<AdminProduct>>(`/products/${id}`, payload);
    return res.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // ─── Bookings ─────────────────────────────────────────
  async getBookings(): Promise<AdminBooking[]> {
    const res = await api.get<ApiResponse<AdminBooking[]>>("/bookings");
    return res.data.data;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<AdminBooking> {
    const res = await api.patch<ApiResponse<AdminBooking>>(`/bookings/${id}/status`, { status });
    return res.data.data;
  },

  async deleteBooking(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },
};
