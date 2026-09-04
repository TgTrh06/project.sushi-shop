import type { User } from "@/features/users/user.types";

export interface CategoryBreakdown { categoryId: string; categoryName: string; count: number; }
export interface SystemStats {
  totalUsers: number;
  newUsersLast30Days: number;
  totalProducts: number;
  activeProducts: number;
  productsByCategory: CategoryBreakdown[];
  totalCategories: number;
  totalReservations: number;
  pendingReservations: number;
  completedReservations: number;
  todayReservations: number;
}

// ─── User ──────────────────────────────────────────────
export type AdminUser = User;

// ─── Category ──────────────────────────────────────────
export type AdminCategory = { id: string; name: string; slug: string; description?: string; createdAt: string | Date; updatedAt: string | Date };
export type CreateCategoryPayload = Pick<AdminCategory, "name" | "description">;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// ─── Product ───────────────────────────────────────────
export interface AdminProduct {
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
export type CreateProductPayload = Omit<AdminProduct, "id" | "slug" | "createdAt" | "updatedAt" | "ratingSummary">;
export type UpdateProductPayload = Partial<CreateProductPayload>;

// ─── Reservation ───────────────────────────────────────
export type AdminReservationStatus = "PENDING_PAYMENT" | "PENDING_APPROVAL" | "PAID" | "CANCELLED" | "COMPLETED";
export interface AdminReservation {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  session: "lunch" | "dinner";
  slotId: string;
  seatCodes: string[];
  totalDeposit: number;
  transactionReference: string;
  vnp_TxnRef?: string;
  paymentExpiredAt?: string | Date;
  approvalExpiresAt?: string | Date;
  status: AdminReservationStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaymentSettings {
  enabled: boolean;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrTemplate: string;
  paymentInstructions: string;
}

export const AdminReservationStatusLabels: Record<AdminReservation["status"], string> = {
  PENDING_PAYMENT: "Pending Payment",
  PENDING_APPROVAL: "Pending Approval",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
}; 

// ─── Review ────────────────────────────────────────────
// API dates are strings after JSON serialization.
export interface AdminReview {
  id: string;
  productId: string;
  product: { slug: string; name: string };
  user: { id: string; name: string; email: string; avatar?: string };
  rating: number;
  comment: string;
  photo_ids?: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard Stats (Legacy compat alias) ─────────────
export type DashboardStats = SystemStats;
