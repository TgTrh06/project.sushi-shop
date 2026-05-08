import api from "@/lib/axios";
import type { User, UpdateUserFormInput } from "@shared/schemas/user.schema";
import type { ApiResponse } from "@/types/response.type";

export const userService = {
  async getMe(): Promise<User> {
    const result = await api.get<ApiResponse<User>>("/users/me");
    return result.data.data;
  },

  async updateProfile(input: UpdateUserFormInput): Promise<User> {
    const result = await api.put("/users/me", { input });
    return result.data.data;
  }
}