export type PaymentStatus = "PENDING" | "PENDING_APPROVAL" | "CONFIRMED" | "REJECTED";

export interface PaymentSettings {
  id: string;
  provider: "VIETQR";
  enabled: boolean;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrTemplate: string;
  paymentInstructions: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationPayment {
  id: string;
  reservationId: string;
  method: "VIETQR";
  amount: number;
  transactionReference: string;
  transferContent: string;
  status: PaymentStatus;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrTemplate: string;
  qrImageUrl: string;
  customerMarkedPaidAt?: Date;
  confirmedBy?: string;
  confirmedAt?: Date;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}
