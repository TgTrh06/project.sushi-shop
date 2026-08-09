import type { ApiResponse } from "@/types/response.type";
import api from "@/lib/axios";
import {
  RESERVATION_CONFIG,
  type SessionType,
} from "@itsu-sushi/shared/config/reservation.config";
import type { ReservationFormValues } from "../schemas/reservation.schema";

export interface CreateReservationResult {
  paymentUrl: string;
  reservationId: string;
  transactionRef: string;
}

export async function getReservationConfig() {
  return RESERVATION_CONFIG;
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
