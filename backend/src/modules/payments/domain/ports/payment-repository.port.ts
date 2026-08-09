import type { TransactionContext } from "@/core/transactions/transaction.port";
import type { PaymentSettings, ReservationPayment, PaymentStatus } from "../entities/payment.entity";

export interface PaymentSettingsRepository { getActive(): Promise<PaymentSettings | null>; save(input: Omit<PaymentSettings, "id" | "createdAt" | "updatedAt">): Promise<PaymentSettings>; }
export interface ReservationPaymentRepository {
  create(input: Omit<ReservationPayment, "id" | "createdAt" | "updatedAt">, context: TransactionContext): Promise<ReservationPayment>;
  findByReservationId(reservationId: string): Promise<ReservationPayment | null>;
  transition(id: string, expected: PaymentStatus, next: PaymentStatus, patch: Partial<ReservationPayment>, context: TransactionContext): Promise<ReservationPayment | null>;
}
