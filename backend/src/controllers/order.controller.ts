import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(_req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  } 
}