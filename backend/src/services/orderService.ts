import OrderModel, { IOrder, OrderInput } from '../models/Order';
import SweetModel from '../models/Sweet';
import mongoose from 'mongoose';

export class OrderService {
  static async createOrder(userId: string, orderData: OrderInput): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const items = [];
      let totalAmount = 0;

      // Validate and process each item
      for (const item of orderData.items) {
        const sweet = await SweetModel.findById(item.sweet_id).session(session);
        if (!sweet) {
          throw new Error(`Sweet with ID ${item.sweet_id} not found`);
        }

        if (sweet.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${sweet.name}. Available: ${sweet.quantity}, Requested: ${item.quantity}`);
        }

        const itemTotal = sweet.price * item.quantity;
        totalAmount += itemTotal;

        items.push({
          sweet_id: sweet._id,
          sweet_name: sweet.name,
          quantity: item.quantity,
          price: sweet.price,
          total: itemTotal,
        });

        // Decrease inventory
        sweet.quantity -= item.quantity;
        await sweet.save({ session });
      }

      // Create order
      const order = new OrderModel({
        user_id: userId,
        items,
        total_amount: totalAmount,
        status: 'completed',
      });

      await order.save({ session });
      await session.commitTransaction();

      return await OrderModel.findById(order._id).populate('user_id', 'email');
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getUserOrders(userId: string): Promise<IOrder[]> {
    return await OrderModel.find({ user_id: userId })
      .sort({ created_at: -1 })
      .populate('user_id', 'email');
  }

  static async getAllOrders(): Promise<IOrder[]> {
    return await OrderModel.find()
      .sort({ created_at: -1 })
      .populate('user_id', 'email');
  }

  static async getOrderById(orderId: string): Promise<IOrder | null> {
    return await OrderModel.findById(orderId).populate('user_id', 'email');
  }

  static async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalItemsSold: number;
    averageOrderValue: number;
  }> {
    const orders = await OrderModel.find({ status: 'completed' });
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const totalItemsSold = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      totalItemsSold,
      averageOrderValue,
    };
  }
}

