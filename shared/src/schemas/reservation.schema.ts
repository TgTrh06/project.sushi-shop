import { z } from "zod";

// =========================================================
// BASE SCHEMAS FOR BOTH FRONTEND & BACKEND
// =========================================================

export const ReservationStatus = [
  "PENDING_PAYMENT",
  "PAID",
  "CANCELLED_REFUNDED",
  "CANCELLED_NO_REFUND",
  "NO_SHOW",
  "COMPLETED",
] as const;

export const BaseReservationSchema = z.object({
  userId: z.string(),
  customerName: z.string().min(2),
  customerPhone: z.string().regex(/^[0-9]{10}$/),
  seatIds: z.array(z.string()).min(1),
  reservationDate: z.string(), // YYYY-MM-DD
  timeSlot: z.string(), // HH:mm
  totalDeposit: z.number().positive(),
  notes: z.string().optional(),
});

export type IReservation = z.infer<typeof BaseReservationSchema> & {
  _id: string;
  status: (typeof ReservationStatus)[number];
  vnp_TxnRef: string; // Mã giao dịch để đối soát VNPay
  createdAt: Date;
};
