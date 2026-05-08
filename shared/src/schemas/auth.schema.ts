import z from "zod";

// =========================================================
// ROLE
// =========================================================

export const Role = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin"
} as const;

export type Role = typeof Role[keyof typeof Role];

// =========================================================
// AUTH SCHEMAS
// =========================================================

export const LoginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(2, "Name must be at least 2 characters").max(30),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(Object.values(Role)).default(Role.CUSTOMER),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ResetPasswordSchema = z
  .object({
    email: z.email("Invalid email"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// =========================================================
// TYPES
// =========================================================

export type LoginFormInput = z.input<typeof LoginSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;

export type RegisterFormInput = z.input<typeof RegisterSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;

export type ResetPasswordFormInput = z.input<typeof ResetPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

// =========================================================
// RE-EXPORT UpdateUserSchema from user.schema for backward compat
// =========================================================

export { UpdateUserSchema } from "./user.schema";
export type { UpdateUserFormInput, UpdateUserFormValues } from "./user.schema";
