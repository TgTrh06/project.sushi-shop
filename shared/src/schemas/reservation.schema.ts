import { z } from "zod";

export const ReservationStatus = [
  "PENDING_PAYMENT",
  "PENDING_APPROVAL",
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
  customerPhone: z.string().regex(/^(0|\+84)[35789][0-9]{8}$/, "Invalid Vietnamese phone number"),

  // Booking Details
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  session: z.enum(["lunch", "dinner"]),
  slotId: z.string().min(1, "Time slot is required"),
  seatCodes: z.array(z.string().trim().min(1)).min(1, "At least one seat must be selected").max(8).superRefine((seats, ctx) => {
    if (new Set(seats).size !== seats.length) {
      ctx.addIssue({ code: "custom", message: "Duplicate seats are not allowed" });
    }
  }),

  // Payment Information
  totalDeposit: z.number().int().min(0, "Deposit cannot be negative"),
  transactionReference: z.string().min(1, "Transaction reference is required"),
  // Kept optional for read compatibility with legacy reservation documents.
  vnp_TxnRef: z.string().min(1).optional(),
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
  customerName: true,
  customerPhone: true,
  reservationDate: true,
  session: true,
  slotId: true,
  seatCodes: true,
  totalDeposit: true
});
