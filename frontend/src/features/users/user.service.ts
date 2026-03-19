import api from "../../lib/api";
import type { User } from "./user.types";
import type { UpdateProfileDTO } from "./user.schema";
import type { ApiResponse } from "../../types/response.type";

export const userService = {
  getMe: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>("/users/me")
    return res.data.data
  },

  updateProfile: async (dto: UpdateProfileDTO) => {
    const res = await api.put("/users/me", dto)
    return res.data.data
  }
}