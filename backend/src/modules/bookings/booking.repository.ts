import { BookingModel } from "./booking.model";

export const bookingRepository = {
  async create(data: any) {
    return BookingModel.create(data);
  },

  async findAll() {
    return BookingModel.find().sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return BookingModel.findById(id);
  },

  async updateStatus(id: string, status: string) {
    return BookingModel.findByIdAndUpdate(id, { status }, { new: true });
  },

  async delete(id: string) {
    return BookingModel.findByIdAndDelete(id);
  },

  async count() {
    return BookingModel.countDocuments();
  },
};