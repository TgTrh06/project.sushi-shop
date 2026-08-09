import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(2, "Name must be at least 2 characters").max(30),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginFormInput = z.input<typeof LoginSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormInput = z.input<typeof RegisterSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;
