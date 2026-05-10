import { z } from "zod";

// // =========================================================
// // 1. VNPAY/PAY TRANSACTION CONSTANTS
// // =========================================================

// /**
//  * Enum representing VNPAY/PAY transaction status codes.
//  */
// export const TransactionStatus = {
//   SUCCESS: '00',
//   INCOMPLETE: '01',
//   FAILED: '02',
//   /** Reversed transaction: Charged at the bank but failed at VNPAY */
//   REVERSED: '04',
//   /** Processing refund */
//   PROCESSING: '05',
//   /** Refund request sent to the bank */
//   REFUND_SENT: '06',
//   SUSPECTED_FRAUD: '07',
//   REFUND_REJECTED: '09',
// } as const;

// export type TransactionStatusCode = typeof TransactionStatus[keyof typeof TransactionStatus];

// /**
//  * Mapping of status codes to their respective English descriptions.
//  */
// export const TRANSACTION_STATUS_MESSAGES: Record<TransactionStatusCode, string> = {
//   [TransactionStatus.SUCCESS]: 'Transaction successful',
//   [TransactionStatus.INCOMPLETE]: 'Transaction incomplete',
//   [TransactionStatus.FAILED]: 'Transaction failed',
//   [TransactionStatus.REVERSED]: 'Reversed transaction (Customer charged at Bank, but failed at VNPAY)',
//   [TransactionStatus.PROCESSING]: 'VNPAY is processing this transaction (Refund)',
//   [TransactionStatus.REFUND_SENT]: 'Refund request sent to the Bank',
//   [TransactionStatus.SUSPECTED_FRAUD]: 'Suspected fraudulent transaction',
//   [TransactionStatus.REFUND_REJECTED]: 'Refund rejected',
// };

// // =========================================================
// // 2. RESERVATION SYSTEM CONSTANTS
// // =========================================================

// export const ReservationStatus = [
//   "PENDING_PAYMENT",
//   "PAID",
//   "CANCELLED_REFUNDED",
//   "CANCELLED_NO_REFUND",
//   "NO_SHOW",
//   "COMPLETED",
// ] as const;

// export type ReservationStatusType = (typeof ReservationStatus)[number];

// /**
//  * Logic mapping: Translates VNPAY status to internal Reservation status.
//  */
// export const MAP_TRANSACTION_TO_RESERVATION: Record<TransactionStatusCode, ReservationStatusType> = {
//   [TransactionStatus.SUCCESS]: "PAID",
//   [TransactionStatus.INCOMPLETE]: "PENDING_PAYMENT",
//   [TransactionStatus.FAILED]: "CANCELLED_NO_REFUND",
//   [TransactionStatus.REVERSED]: "CANCELLED_REFUNDED",
//   [TransactionStatus.PROCESSING]: "PENDING_PAYMENT",
//   [TransactionStatus.REFUND_SENT]: "CANCELLED_REFUNDED",
//   [TransactionStatus.SUSPECTED_FRAUD]: "CANCELLED_NO_REFUND",
//   [TransactionStatus.REFUND_REJECTED]: "PAID",
// };

export const ReservationStatus = [
  "PENDING_PAYMENT",
  "PAID",
  "CANCELLED",
] as const;

// =========================================================
// ZOD SCHEMAS (VALIDATION)
// =========================================================

export const BaseReservationSchema = z.object({
  id: z.string(),
  // userId: z.string(),

  // Customer Information
  customerName: z.string().trim().min(2, "Name is too short"),
  customerPhone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Invalid Vietnamese phone number"),

  // Booking Details
  seatCodes: z.array(z.string()).min(1, "At least one seat must be selected"),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  timeSlot: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format must be HH:mm"),

  // Payment Information
  totalDeposit: z.number().min(0, "Deposit cannot be negative"),
  vnp_TxnRef: z.string().min(1, "Transaction reference is required"),

  // Status with strict validation
  status: z.enum(ReservationStatus),

  // notes: z.string().max(500, "Notes are too long").optional().nullable(),

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
  seatCodes: true,
  reservationDate: true,
  timeSlot: true,
  totalDeposit: true,
});