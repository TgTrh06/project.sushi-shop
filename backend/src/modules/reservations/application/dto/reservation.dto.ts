import type { ReservationEntity } from "../../domain/entities/reservation.entity";
import type { ReservationPayment } from "@/modules/payments/domain/entities/payment.entity";

export interface CreateReservationCommand { userId: string; customerName: string; customerPhone: string; reservationDate: string; session: "lunch" | "dinner"; slotId: string; seatCodes: string[]; totalDeposit: number; }
export interface ReservationPaymentView { method: "VIETQR"; amount: number; expiresAt?: Date; bankCode: string; bankName: string; accountNumber: string; accountName: string; transferContent: string; qrImageUrl: string; status: string; customerMarkedPaidAt?: Date; confirmedAt?: Date; }
export interface CreateReservationResult { reservation: ReservationEntity; reservationId: string; transactionRef: string; paymentUrl: string; payment: ReservationPaymentView; }
export function paymentView(payment: ReservationPayment, expiresAt?: Date): ReservationPaymentView { return { method: payment.method, amount: payment.amount, expiresAt, bankCode: payment.bankCode, bankName: payment.bankName, accountNumber: payment.accountNumber, accountName: payment.accountName, transferContent: payment.transferContent, qrImageUrl: payment.qrImageUrl, status: payment.status, customerMarkedPaidAt: payment.customerMarkedPaidAt, confirmedAt: payment.confirmedAt }; }
