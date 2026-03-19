import api from "../../lib/api";
import type { LoginInput, RegisterInput } from "./auth.schema";
import { type ApiResponse } from "../../types/response.type";
import type { User } from "../users/user.types";

export interface AuthResponse {
  user: User;
}

export const authService = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const result = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      input,
    );
    return result.data.data;
  },

  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const result = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      input,
    );
    return result.data.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },
};