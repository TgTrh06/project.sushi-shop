import { z } from "zod";

export const ReservationStatus = [
  "PENDING_PAYMENT",
  "PAID",
  "CANCELLED",
  "COMPLETED",
] as const;

export type ReservationStatusType = (typeof ReservationStatus)[number];

// =========================================================
// ZOD SCHEMAS (VALIDATION)
// =========================================================

export const BaseReservationSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),

  // Customer Information
  customerName: z.string().trim().min(2, "Name is too short"),
  customerPhone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Invalid Vietnamese phone number"),

  // Booking Details
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  session: z.enum(["lunch", "dinner"]),
  slotId: z.string().min(1, "Time slot is required"),
  seatCodes: z.array(z.string()).min(1, "At least one seat must be selected"),

  // Payment Information
  totalDeposit: z.number().min(0, "Deposit cannot be negative"),
  vnp_TxnRef: z.string().min(1, "Transaction reference is required"),
  paymentExpiredAt: z.coerce.date().optional(),

  // Status with strict validation
  status: z.enum(ReservationStatus),

  // Metadata
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// =========================================================
// EXPORTED TYPES & UTILITIES
// =========================================================

export const CreateReservationSchema = BaseReservationSchema.pick({
  userId: true,
  customerName: true,
  customerPhone: true,
  reservationDate: true,
  session: true,
  slotId: true,
  seatCodes: true,
  totalDeposit: true
});