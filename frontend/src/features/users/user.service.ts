import api from "@/lib/axios";
import type { User, UpdateUserFormInput, ChangePasswordFormInput } from "@shared/schemas/user.schema";
import type { ApiResponse } from "@/types/response.type";

export const userService = {
  async getMe(): Promise<User> {
    const result = await api.get<ApiResponse<User>>("/users/me");
    return result.data.data;
  },

  async updateProfile(input: UpdateUserFormInput): Promise<User> {
    const result = await api.put<ApiResponse<User>>("/users/me", input);
    return result.data.data;
  },

  async changePassword(input: ChangePasswordFormInput): Promise<void> {
    await api.put("/users/me/password", input);
  },
};
