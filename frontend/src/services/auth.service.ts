import api from "../lib/api";
import type { LoginInput } from "../schemas/auth.schema";

export const authService = {
  login: async (input: LoginInput) => {
    const res = await api.post("/auth/login", input)
    return res.data.data
  }
}