import z from "zod";
import type { ClientSession, Types } from "mongoose";
import { BaseReservationSchema, CreateReservationSchema } from "@itsu-sushi/shared/schemas/reservation.schema";

export type ReservationEntity = z.infer<typeof BaseReservationSchema>;

export type ReservationDocument = Omit<ReservationEntity, "id"> & {
    userId?: Types.ObjectId;
};

export type CreateReservationInput = z.input<typeof CreateReservationSchema>;
export type CreateReservationDTO = z.infer<typeof CreateReservationSchema>;
export type ReservationDbSession = ClientSession;
