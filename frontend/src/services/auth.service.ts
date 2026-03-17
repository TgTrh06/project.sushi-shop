import api from "../api/axiosInstance";
import type { LoginDTO } from "../schemas/auth.schema";

export const authService = {
  login: async (dto: LoginDTO) => {
    const res = await api.post("/auth/login", dto)
    return res.data.data
  }
}