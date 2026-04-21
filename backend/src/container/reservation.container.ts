import ReservationController from "@/modules/resevations/reservation.controller";
import ReservationRepository from "@/modules/resevations/reservation.repository";
import ReservationService from "@/modules/resevations/reservation.service";

export const reservationRepo = new ReservationRepository();
export const reservationService = new ReservationService(reservationRepo);
export const reservationController = new ReservationController(reservationService);
