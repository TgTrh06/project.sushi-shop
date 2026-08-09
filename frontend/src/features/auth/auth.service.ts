import api from "@/lib/axios";
import type { AuthResponse } from "./auth.type";
import type { ApiResponse } from "@/types/response.type";
import type { LoginFormInput, RegisterFormInput } from "./schemas/auth.schema";

export const authService = {
  async register(input: RegisterFormInput): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/register", { input });
    return result.data.data; // accessToken and user info are in the data property of the API response
  },

  async login(input: LoginFormInput): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<AuthResponse>>("/auth/login", { input });
    return result.data.data; // accessToken and user info are in the data property of the API response
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async refresh(): Promise<AuthResponse> {
    const result = await api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
    const { accessToken } = result.data.data;
    const profile = await api.get<ApiResponse<AuthResponse["user"]>>("/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return { accessToken, user: profile.data.data };
  },

};
