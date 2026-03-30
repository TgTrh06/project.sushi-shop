import { z } from "zod"

// --- Enums ---
export const UserRoleSchema = z.enum(['ADMIN', 'CUSTOMER']);
export const UserStatusSchema = z.enum(['active', 'inactive']);

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;

// --- User ---
export const UserSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// --- Auth ---
export const RegisterInputSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).min(1),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;
