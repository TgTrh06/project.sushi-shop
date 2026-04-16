import api from "@/lib/axios";
import type { AuthResponse } from "./auth.type";
import type { ApiResponse } from "@/types/response.type";
import type { LoginFormInput, RegisterFormInput, ResetPasswordFormInput } from "@shared/schemas/auth.schema";

export const authService = {
  async signUp(input: RegisterFormInput): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/register", { input });
    return result.data.data; // accessToken and user info are in the data property of the API response
  },

  async signIn(input: LoginFormInput): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/login", { input });
    return result.data.data; // accessToken and user info are in the data property of the API response
  },

  async signOut(): Promise<void> {
    await api.post("/auth/logout");
  },

  async refreshToken(): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");
    return result.data.data; // accessToken
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  async resetPassword(input: ResetPasswordFormInput): Promise<void> {
    await api.post("/auth/reset-password", {
      email: input.email,
      newPassword: input.newPassword,
      confirmPassword: input.confirmPassword,
    });
  }
};