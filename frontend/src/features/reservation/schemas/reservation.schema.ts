import { z } from "zod";
import { CreateReservationSchema } from "@itsu-sushi/shared/schemas/reservation.schema";

export const reservationFormSchema = CreateReservationSchema.omit({
  totalDeposit: true,
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
