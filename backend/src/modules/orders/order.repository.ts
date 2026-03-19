import BaseRepository from "../../core/base.repository";
import {
  OrderEntity,
  CreateOrderDTO,
  UpdateOrderDTO,
} from "./order.types";
import { OrderModel } from "./order.model";

export default class OrderRepository extends BaseRepository<
  OrderEntity,
  CreateOrderDTO,
  UpdateOrderDTO
> {
  constructor() {
    super(OrderModel);
  }

  protected mapToEntity(doc: any): OrderEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId ? doc.userId.toString() : null,
      guestInfo: doc.guestInfo,
      note: doc.note,
      totalPrice: doc.totalPrice,
      orderType: doc.orderType,
      status: doc.status,
      items: doc.items.map((item: any) => ({
        productId: item.productId.toString(),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: doc.createdAt,
    };
  }
}