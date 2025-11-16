import SweetModel from '../models/Sweet';
import mongoose from 'mongoose';

export class InventoryService {
  static async purchaseSweet(id: string, quantity: number = 1): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid sweet ID');
    }

    const sweet = await SweetModel.findById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    const newQuantity = sweet.quantity - quantity;
    const updated = await SweetModel.findByIdAndUpdate(
      id,
      { $set: { quantity: newQuantity } },
      { new: true }
    );
    
    if (!updated) {
      throw new Error('Failed to update inventory');
    }

    return updated;
  }

  static async restockSweet(id: string, quantity: number): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid sweet ID');
    }

    if (quantity <= 0) {
      throw new Error('Restock quantity must be positive');
    }

    const sweet = await SweetModel.findById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }

    const newQuantity = sweet.quantity + quantity;
    const updated = await SweetModel.findByIdAndUpdate(
      id,
      { $set: { quantity: newQuantity } },
      { new: true }
    );
    
    if (!updated) {
      throw new Error('Failed to update inventory');
    }

    return updated;
  }
}

