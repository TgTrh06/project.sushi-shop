import { bookingRepository } from "./booking.repository";
import { CreateBookingDTO } from "@shared/schemas/booking.schema";

export const bookingService = {
  async createBooking(data: CreateBookingDTO) {
    // TODO: check slot (optional nâng cao)
    return bookingRepository.create(data);
  },

  async getBookings() {
    return bookingRepository.findAll();
  },
};