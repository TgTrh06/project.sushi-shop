import { z } from "zod";

export const reservationFormSchema = z.object({
  customerName: z.string().trim().min(2, "Name is too short"),
  customerPhone: z.string().regex(/^(0|\+84)[35789][0-9]{8}$/, "Invalid Vietnamese phone number"),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  session: z.enum(["lunch", "dinner"]),
  slotId: z.string().min(1, "Time slot is required"),
  seatCodes: z.array(z.string().trim().min(1)).min(1, "At least one seat must be selected").max(8).superRefine((seats, ctx) => {
    if (new Set(seats).size !== seats.length) ctx.addIssue({ code: "custom", message: "Duplicate seats are not allowed" });
  }),
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
