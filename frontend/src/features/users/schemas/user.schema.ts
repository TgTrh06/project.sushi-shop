import { z } from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export const UpdateUserSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters").max(30).optional(),
  avatar_id: z.string().optional(),
  phoneNumber: z.number().int().positive().optional(),
});

export type ChangePasswordFormInput = z.input<typeof ChangePasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
export type UpdateUserFormInput = z.input<typeof UpdateUserSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;
