import { z } from "zod";
import type { User } from "@shared/schemas/user.schema";
import type { BaseProductSchema } from "@shared/schemas/product.schema";
import type { SystemStats, CategoryBreakdown } from "@shared/schemas/stats.schema";
import type { BaseCategorySchema } from "@shared/schemas/category.schema";

// Re-export shared stats types for convenience
export type { SystemStats, CategoryBreakdown };

// ─── User ──────────────────────────────────────────────
export type AdminUser = User;

// ─── Category ──────────────────────────────────────────
export type AdminCategory = z.infer<typeof BaseCategorySchema>;

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

// ─── Product ───────────────────────────────────────────
export type AdminProduct = z.infer<typeof BaseProductSchema>;

export type CreateProductPayload = Omit<AdminProduct, "id" | "slug" | "createdAt" | "updatedAt"| "ratingSummary">;

export type UpdateProductPayload = Partial<CreateProductPayload>;

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
