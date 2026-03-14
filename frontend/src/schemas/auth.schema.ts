import z from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be least 6 characters"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;