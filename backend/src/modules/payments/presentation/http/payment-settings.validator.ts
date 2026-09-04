import { z } from "zod";

export const PaymentSettingsSchema = z.object({
  enabled: z.boolean(),
  bankCode: z.string().trim().min(2).max(30),
  bankName: z.string().trim().min(2).max(100),
  accountNumber: z.string().trim().regex(/^\d{6,20}$/, "Invalid account number"),
  accountName: z.string().trim().min(2).max(100),
  qrTemplate: z.string().trim().min(1).max(30).default("compact2"),
  paymentInstructions: z.string().trim().max(1000).default(""),
});
