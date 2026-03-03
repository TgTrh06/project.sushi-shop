import { Schema, model, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId?: Types.ObjectId;
  guestInfo?: {
    name: string;
    phone: string;
    address: string;
  };
  note?: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered" | "canceled";
  items: {
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}