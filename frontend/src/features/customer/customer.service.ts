import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { CustomerReservation } from "./customer.types";

export const customerService = {
  async getMyReservations(): Promise<CustomerReservation[]> {
    const response = await api.get<ApiResponse<CustomerReservation[]>>("/reservations/my-reservations");
    return response.data.data;
  },
};
