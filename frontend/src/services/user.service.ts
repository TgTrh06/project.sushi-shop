import api from "../api/axios";
import type { UpdateProfileDTO } from "../schemas/user.schema";

export const userService = {
  getProfile: async () => {
    const res = await api.get("/users/me")
    return res.data
  },

  updateProfile: async (data: UpdateProfileDTO) => {
    const res = await api.put("/users/me", data)
    return res.data
  }
}