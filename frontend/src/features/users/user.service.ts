import api from "../../lib/axios";
import type { User } from "./user.types";
import type { ApiResponse } from "../../types/response.type";
import type { UpdateUserFormInput } from "@shared/schemas/auth.schema";

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