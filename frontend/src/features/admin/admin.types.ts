import { z } from "zod";
import type { User } from "@shared/schemas/user.schema";
import type { BaseProductSchema } from "@shared/schemas/product.schema";
import type { SystemStats, CategoryBreakdown } from "@shared/schemas/stats.schema";
import type { BaseCategorySchema, CreateCategorySchema, UpdateCategorySchema } from "@shared/schemas/category.schema";
import type { BaseReviewSchema } from "@shared/schemas/review.schema";

// Re-export shared stats types for convenience
export type { SystemStats, CategoryBreakdown };

// ─── User ──────────────────────────────────────────────
export type AdminUser = User;

// ─── Category ──────────────────────────────────────────
export type AdminCategory = z.infer<typeof BaseCategorySchema>;
export type CreateCategoryPayload = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryPayload = z.infer<typeof UpdateCategorySchema>;

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

// ─── Review ────────────────────────────────────────────
// Derived from the shared schema; dates are strings in API responses (JSON serialization)
export type AdminReview = Omit<z.infer<typeof BaseReviewSchema>, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// ─── Dashboard Stats (Legacy compat alias) ─────────────
export type DashboardStats = SystemStats;
