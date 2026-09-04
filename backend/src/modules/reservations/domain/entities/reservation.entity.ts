export type ReservationSession = "lunch" | "dinner";
export type ReservationStatus = "PENDING_PAYMENT" | "PENDING_APPROVAL" | "PAID" | "CANCELLED" | "COMPLETED";

export interface ReservationEntity {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  session: ReservationSession;
  slotId: string;
  seatCodes: string[];
  totalDeposit: number;
  transactionReference: string;
  paymentExpiredAt?: Date;
  approvalExpiresAt?: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationInput {
  userId: string;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  session: ReservationSession;
  slotId: string;
  seatCodes: string[];
  totalDeposit: number;
  transactionReference: string;
  paymentExpiredAt: Date;
  status: "PENDING_PAYMENT";
}
