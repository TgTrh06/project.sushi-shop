import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
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
  PaginatedResult,
  BookingStatus,
} from "./admin.types";

// ─── Dashboard ─────────────────────────────────────────
export const adminService = {
  async getStats(): Promise<SystemStats> {
    const res = await api.get<ApiResponse<SystemStats>>("/admin/stats");
    return res.data.data;
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
