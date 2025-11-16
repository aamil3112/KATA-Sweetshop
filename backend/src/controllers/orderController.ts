import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { body, validationResult } from 'express-validator';

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = (req as any).user.userId;
      const order = await OrderService.createOrder(userId, req.body);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const orders = await OrderService.getUserOrders(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.status(200).json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await OrderService.getOrderStats();
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items array is required and must not be empty'),
  body('items.*.sweet_id').notEmpty().withMessage('Sweet ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

