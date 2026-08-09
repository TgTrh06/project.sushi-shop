import { RESERVATION_CONFIG } from "../../domain/config/reservation.config";
import { SEATS } from "../../domain/config/seat-map.config";

export type ReservationConfigDto = {
  depositPerSeat: number;
  maxSeatsPerReservation: number;
  paymentExpiryMinutes: number;
  sessions: typeof RESERVATION_CONFIG.sessions;
  seats: typeof SEATS;
};

export function reservationConfigView(): ReservationConfigDto {
  return {
    depositPerSeat: RESERVATION_CONFIG.depositPerSeat,
    maxSeatsPerReservation: RESERVATION_CONFIG.maxSeatsPerReservation,
    paymentExpiryMinutes: RESERVATION_CONFIG.paymentExpiryMinutes,
    sessions: RESERVATION_CONFIG.sessions,
    seats: SEATS,
  };
}
