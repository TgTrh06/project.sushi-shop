import { BookingModel } from "./booking.model";

export const bookingRepository = {
  async create(data: any) {
    return BookingModel.create(data);
  },

  async findAll() {
    return BookingModel.find().sort({ createdAt: -1 });
  },
};