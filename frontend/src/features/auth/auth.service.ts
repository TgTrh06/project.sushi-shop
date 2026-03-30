import api from "../../lib/api";
import type { LoginInput, RegisterInput, ResetPasswordInput } from "./auth.schema";
import { type ApiResponse } from "../../types/response.type";
import type { User } from "../users/user.types";

export interface AuthResponse {
  user: User;
}

export const authService = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/login", input);
    return result.data.data;
  },

  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/register", input);
    return result.data.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (input: ResetPasswordInput): Promise<void> => {
    await api.post("/auth/reset-password", {
      email: input.email,
      newPassword: input.newPassword,
    });
  },

  logout: async () => {
    await api.post("/auth/logout");
  },
};