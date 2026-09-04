import type { ApiResponse } from "@/types/response.type";
import api from "@/lib/axios";
import type { ReservationFormValues } from "../schemas/reservation.schema";
import type { ReservationConfig, SessionType } from "../types/reservation.types";

export interface CreateReservationResult {
  paymentUrl: string;
  reservationId: string;
  transactionRef: string;
  payment: ReservationPayment;
}

export interface ReservationPayment {
  method: "VIETQR";
  amount: number;
  expiresAt?: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
  qrImageUrl: string;
  status: "PENDING" | "PENDING_APPROVAL" | "CONFIRMED" | "REJECTED";
  customerMarkedPaidAt?: string;
  confirmedAt?: string;
}

export interface ReservationPaymentResponse {
  reservation: { id: string; status: string; totalDeposit: number; transactionReference: string };
  payment: ReservationPayment;
}

export async function getReservationConfig(): Promise<ReservationConfig> {
  const response = await api.get<ApiResponse<ReservationConfig>>("/reservations/config");
  return response.data.data;
}

export async function getOccupiedSeats(
  date: string,
  session: SessionType | undefined,
  slotId: string | undefined,
): Promise<string[]> {
  if (!session || !slotId) return [];

  const response = await api.get<ApiResponse<string[]>>("/reservations/occupied-seats", {
    params: { date, session, slotId },
  });
  return response.data.data;
}

export async function createReservation(
  payload: ReservationFormValues & { totalDeposit: number },
): Promise<CreateReservationResult> {
  const response = await api.post<ApiResponse<CreateReservationResult>>(
    "/reservations",
    payload,
  );
  return response.data.data;
}

export async function getReservationPayment(id: string): Promise<ReservationPaymentResponse> {
  const response = await api.get<ApiResponse<ReservationPaymentResponse>>(`/reservations/${id}/payment`);
  return response.data.data;
}

export async function confirmReservationPayment(id: string): Promise<ReservationPaymentResponse> {
  const response = await api.post<ApiResponse<ReservationPaymentResponse>>(`/reservations/${id}/confirm-payment`);
  return response.data.data;
}
