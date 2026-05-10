import z from "zod";
import { BaseReservationSchema, CreateReservationSchema } from "@shared/schemas/reservation.schema";

export type ReservationEntity = z.infer<typeof BaseReservationSchema>;

export type ReservationDocument = Omit<ReservationEntity, "id">;

export type CreateReservationInput = z.input<typeof CreateReservationSchema>;
export type CreateReservationDTO = z.infer<typeof CreateReservationSchema>;