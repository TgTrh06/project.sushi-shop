import { Schema, model, Document, Types } from "mongoose";

export interface IOrder {
  userId?: Types.ObjectId;
  guestInfo?: {
    name: string;
    phone: string;
    address: string;
  };
  note?: string;
  totalPrice: number;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "DELIVERING"
    | "DELIVERED"
    | "CANCELED";
  items: {
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}