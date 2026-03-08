import { Types } from "mongoose";

// Business Entity
export interface OrderEntity {
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