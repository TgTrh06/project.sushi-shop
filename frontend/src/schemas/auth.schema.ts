import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must have least 6 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;