import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: String,
    email: String,
    phone: String,
    date: String,
    time: String,
    guests: Number,
    note: String,
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model("Booking", bookingSchema);