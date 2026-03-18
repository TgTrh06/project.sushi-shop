import api from "../lib/api";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { type ApiResponse } from "../types/api.type";

export interface AuthResponse {
  token: string;
}

export const authService = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/login", input)
    return result.data.data
  },

  register: async (input: RegisterInput) => {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/register", input)
    return result.data.data
  }
}