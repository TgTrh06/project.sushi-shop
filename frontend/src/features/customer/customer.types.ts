export interface CustomerReservation {
  id: string;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  session: "lunch" | "dinner";
  slotId: string;
  seatCodes: string[];
  totalDeposit: number;
  status: "PENDING_PAYMENT" | "PENDING_APPROVAL" | "PAID" | "CANCELLED" | "COMPLETED";
  transactionReference?: string;
  vnp_TxnRef?: string;
  paymentExpiredAt?: string;
  createdAt: string;
  updatedAt: string;
}
