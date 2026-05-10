export interface CustomerReservation {
  id: string;
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  session: "lunch" | "dinner";
  slotId: string;
  seatCodes: string[];
  totalDeposit: number;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELLED" | "COMPLETED";
  vnp_TxnRef: string;
  paymentExpiredAt?: string;
  createdAt: string;
  updatedAt: string;
}
