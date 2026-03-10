import { OrderRepository } from "../repositories/order.repository";
import { OrderStatus } from "../models/order/order.types";

export class OrderService {
  private repo = new OrderRepository();

  async createOrder(data: any) {
    let totalAmount = 0;

    for (const item of data.items) {
      totalAmount += item.price * item.quantity;
    }

    data.totalPrice = totalAmount;

    return this.repo.create(data);
  }

  async getAllOrders() {
    return this.repo.findAll();
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.repo.update(id, { status });
  }
}