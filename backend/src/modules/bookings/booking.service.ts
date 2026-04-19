import { bookingRepository } from "./booking.repository";

export const bookingService = {
  async createBooking(data: any) {
    return bookingRepository.create(data);
  },

  async getBookings() {
    return bookingRepository.findAll();
  },

  async getBookingById(id: string) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error("Booking not found");
    return booking;
  },

  async updateStatus(id: string, status: string) {
    const booking = await bookingRepository.updateStatus(id, status);
    if (!booking) throw new Error("Booking not found");
    return booking;
  },

  async deleteBooking(id: string) {
    const booking = await bookingRepository.delete(id);
    if (!booking) throw new Error("Booking not found");
    return booking;
  },

  async count() {
    return bookingRepository.count();
  },
};