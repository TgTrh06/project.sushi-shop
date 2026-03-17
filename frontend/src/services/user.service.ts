import api from "../api/axiosInstance";
import type { UpdateProfileDTO } from "../schemas/user.schema";

export const userService = {
  getProfile: async () => {
    const res = await api.get("/users/me")
    return res.data.data
  },

  updateProfile: async (dto: UpdateProfileDTO) => {
    const res = await api.put("/users/me", dto)
    return res.data.data
  }
}