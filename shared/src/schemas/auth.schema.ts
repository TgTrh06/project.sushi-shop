import z from "zod";

export const Role = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin"
} as const;

export type Role = typeof Role[keyof typeof Role];

export const LoginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password too short"),
});

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(2, "Name must be at least 2 characters").max(30),
  confirmPassword: z.string(),
  role: z.enum(Object.values(Role)).default(Role.CUSTOMER),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const UpdateUserSchema = z.object({
  username: z.string().min(2).max(30).optional(),
  password: z.string().min(6, "Password too short").optional(),
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

// --- Types mapping ---
export type LoginFormInput = z.input<typeof LoginSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;

export type RegisterFormInput = z.input<typeof RegisterSchema>; // role?: optional (for useForm)
export type RegisterFormValues = z.infer<typeof RegisterSchema>; // role: required (output after parse)

export type UpdateUserFormInput = z.input<typeof UpdateUserSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;

export type ResetPasswordFormInput = z.input<typeof ResetPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;