import { z } from "zod";

export const CreateReservationSchema = z.object({
  customerName: z.string().trim().min(2, "Name is too short"),
  customerPhone: z.string().regex(/^(0|\+84)[35789][0-9]{8}$/, "Invalid Vietnamese phone number"),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  session: z.enum(["lunch", "dinner"]),
  slotId: z.string().min(1, "Time slot is required"),
  seatCodes: z.array(z.string().trim().min(1)).min(1, "At least one seat must be selected").max(8).superRefine((seats, ctx) => {
    if (new Set(seats).size !== seats.length) ctx.addIssue({ code: "custom", message: "Duplicate seats are not allowed" });
  }),
  totalDeposit: z.number().int().min(0, "Deposit cannot be negative"),
});

export const ApprovePaymentSchema = z.object({
  receivedAmount: z.coerce.number().int().nonnegative(),
  note: z.string().trim().max(500).optional(),
});

export const RejectPaymentSchema = z.object({
  note: z.string().trim().max(500).optional(),
});
