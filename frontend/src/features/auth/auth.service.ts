import api from "../../lib/axios";
import type { AuthResponse } from "./auth.type";
import type { LoginInput, RegisterInput, ResetPasswordInput } from "@shared/schemas/auth.schema";
import type { ApiResponse } from "../../types/response.type";

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/login", input);
    return result.data.data;
  },

  async register (input: RegisterInput): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/register", input);
    return result.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    await api.post("/auth/reset-password", {
      email: input.email,
      newPassword: input.newPassword,
    });
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};