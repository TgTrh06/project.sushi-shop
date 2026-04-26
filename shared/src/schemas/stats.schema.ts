import { z } from "zod";

// =========================================================
// SYSTEM STATS SCHEMA — Shared between Frontend & Backend
// =========================================================

export const CategoryBreakdownSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  count: z.number(),
});

export const SystemStatsSchema = z.object({
  // Users
  totalUsers: z.number(),
  newUsersLast30Days: z.number(),

  // Products
  totalProducts: z.number(),
  activeProducts: z.number(),
  productsByCategory: z.array(CategoryBreakdownSchema),

  // Categories
  totalCategories: z.number(),

  // Reservations
  totalReservations: z.number(),
  pendingReservations: z.number(),
  completedReservations: z.number(),
  todayReservations: z.number(),
});

export type SystemStats = z.infer<typeof SystemStatsSchema>;
export type CategoryBreakdown = z.infer<typeof CategoryBreakdownSchema>;
