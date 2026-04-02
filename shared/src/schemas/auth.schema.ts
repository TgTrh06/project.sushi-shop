import { z } from "zod";

export const RegisterInputSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginInputSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const RefreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1),
});

export const UpdateUserInputSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.email().optional(),
  password: z.string().min(6).regex(/[A-Z]/).regex(/[0-9]/).optional(),
});

export const ResetPasswordInputSchema = z
  .object({
    email: z.email("Invalid email"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;
