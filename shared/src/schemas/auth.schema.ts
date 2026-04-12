import z from "zod";

export const Role = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin"
} as const;

export type Role = typeof Role[keyof typeof Role];

export const RegisterInputSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(Object.values(Role)).default(Role.CUSTOMER),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginInputSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const UpdateUserInputSchema = z.object({
  username: z.string().min(3).max(30).optional(),
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

export type RegisterFormInput = z.input<typeof RegisterInputSchema>;   // role?: optional (for useForm)
export type RegisterFormValues = z.infer<typeof RegisterInputSchema>;  // role: required (output after parse)

export type LoginFormValues = z.infer<typeof LoginInputSchema>;

export type UpdateUserFormInput = z.input<typeof UpdateUserInputSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserInputSchema>;

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordInputSchema>;
