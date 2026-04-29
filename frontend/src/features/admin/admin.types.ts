import type { Role } from "@shared/schemas/auth.schema";
import type { SystemStats, CategoryBreakdown } from "@shared/schemas/stats.schema";

// Re-export shared stats types for convenience
export type { SystemStats, CategoryBreakdown };

// ─── User ──────────────────────────────────────────────
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt?: string;
}

// ─── Category ──────────────────────────────────────────
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

// ─── Product ───────────────────────────────────────────
export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  description?: string;
  categoryId: string;
  isAvailable: boolean;
  stockQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  image?: string;
  description?: string;
  categoryId: string;
  isAvailable?: boolean;
  stockQuantity: number;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

// ─── Booking ───────────────────────────────────────────
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface AdminBooking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
  status: BookingStatus;
  createdAt?: string;
}

// ─── Dashboard Stats (Legacy compat alias) ─────────────
export type DashboardStats = SystemStats;

// ─── Pagination ────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
