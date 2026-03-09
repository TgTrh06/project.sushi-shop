import { Types } from "mongoose";

// Types for Order
export enum OrderType {
  DINE_IN = "DINE_IN",
  TAKEAWAY = "TAKEAWAY",
  DELIVERY = "DELIVERY"
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}

// Business Entity
export interface OrderEntity {
  id: string;
  userId?: Types.ObjectId;
  guestInfo?: {
    name: string;
    phone: string;
    address: string;
  };
  note?: string;
  totalPrice: number;
  orderType: OrderType;
  status: OrderStatus;
  items: {
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}

// Types for DTOs
type RequiredFields = Pick<
  OrderEntity,
  "totalPrice" | "orderType" | "status" | "items"
>;

type OptionalFields = Partial<Omit<OrderEntity, keyof RequiredFields>>;

// DTOs
export interface CreateOrderDTO extends RequiredFields, OptionalFields {}

export interface UpdateOrderDTO extends Partial<CreateOrderDTO> {}

// Database shape (Mongoose Document)
export interface OrderDocument extends Omit<OrderEntity, "id"> {}