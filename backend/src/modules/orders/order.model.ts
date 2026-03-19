import { Schema, model, Types } from "mongoose";

import { OrderDocument, OrderType, OrderStatus } from "./order.types";

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    guestInfo: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    note: { type: String },
    totalPrice: { type: Number, required: true },
    orderType: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    items: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      }
    ],
    createdAt: { type: Date, default: Date.now },
  }
);

export const OrderModel = model<OrderDocument>("Order", OrderSchema);