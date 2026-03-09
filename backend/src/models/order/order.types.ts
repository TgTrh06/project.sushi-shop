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