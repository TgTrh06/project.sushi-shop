import api from "../api/axios";
import type { LoginDTO } from "../schemas/auth.schema";

export const authService = {
  login: async (data: LoginDTO) => {
    const res = await api.post("/auth/login", data)
    return res.data
  }
}