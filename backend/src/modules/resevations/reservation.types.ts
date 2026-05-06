import { IReservation } from "@shared/schemas/reservation.schema";
export type CreateReservationPayload = Omit<IReservation, "_id" | "status" | "vnp_TxnRef" | "createdAt" | "updatedAt">;
export type ReservationResponse = IReservation & {
  updatedAt?: Date;
};
export interface ReservationWithPayment {
  reservation: ReservationResponse;
  paymentUrl: string;
}
export interface CancellationResult {
  message: string;
  refundedAmount?: number;
}
