import z from "zod";

export const Role = {
  ADMIN: "admin",
  CUSTOMER: "customer"
} as const;

export type Role = typeof Role[keyof typeof Role];

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be least 6 characters"),
});

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.enum([Role.ADMIN, Role.CUSTOMER]).default(Role.CUSTOMER)
});

export type LoginDTO = z.infer<typeof LoginSchema>;