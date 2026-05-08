import z from "zod";

// =========================================================
// ROLE — defined here as the base user concept
// =========================================================

export const Role = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin"
} as const;

export type Role = typeof Role[keyof typeof Role];

// =========================================================
// BASE USER SCHEMA — shared source of truth for User shape
// =========================================================

export const BaseUserSchema = z.object({
  id: z.string(),
  username: z.string().min(2).max(30),
  email: z.email(),
  role: z.enum(Object.values(Role) as [typeof Role[keyof typeof Role], ...typeof Role[keyof typeof Role][]]),
  avatar_id: z.string().optional(),
  phoneNumber: z.number().int().positive().optional(),
  passwordLastUpdated: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
});

// =========================================================
// UPDATE PROFILE SCHEMA (no password)
// =========================================================

export const UpdateUserSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters").max(30).optional(),
  avatar_id: z.string().optional(),
  phoneNumber: z.number().int().positive().optional(),
});

// =========================================================
// CHANGE PASSWORD SCHEMA
// =========================================================

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// =========================================================
// TYPES
// =========================================================

export type User = z.infer<typeof BaseUserSchema>;

export type UpdateUserFormInput = z.input<typeof UpdateUserSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;

export type ChangePasswordFormInput = z.input<typeof ChangePasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
