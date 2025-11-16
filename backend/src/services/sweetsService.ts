import SweetModel, { SweetInput, SweetUpdate } from '../models/Sweet';
import mongoose from 'mongoose';

export class SweetsService {
  static async getAllSweets(): Promise<any[]> {
    return await SweetModel.find().sort({ created_at: -1 });
  }

  static async getSweetById(id: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid sweet ID');
    }
    const sweet = await SweetModel.findById(id);
    if (!sweet) {
      throw new Error('Sweet not found');
    }
    return sweet;
  }

  static async searchSweets(searchParams: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<any[]> {
    const query: any = {};

    if (searchParams.name) {
      query.name = { $regex: searchParams.name, $options: 'i' };
    }

    if (searchParams.category) {
      query.category = { $regex: searchParams.category, $options: 'i' };
    }

    if (searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) {
      query.price = {};
      if (searchParams.minPrice !== undefined) {
        query.price.$gte = searchParams.minPrice;
      }
      if (searchParams.maxPrice !== undefined) {
        query.price.$lte = searchParams.maxPrice;
      }
    }

    return await SweetModel.find(query).sort({ created_at: -1 });
  }

  static async createSweet(sweetData: SweetInput): Promise<any> {
    // Validate required fields
    if (!sweetData.name || !sweetData.category || sweetData.price === undefined) {
      throw new Error('Name, category, and price are required');
    }

    if (sweetData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (sweetData.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    return await SweetModel.create(sweetData);
  }

  static async updateSweet(id: string, sweetData: SweetUpdate): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid sweet ID');
    }

    const existingSweet = await SweetModel.findById(id);
    if (!existingSweet) {
      throw new Error('Sweet not found');
    }

    if (sweetData.price !== undefined && sweetData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (sweetData.quantity !== undefined && sweetData.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const updated = await SweetModel.findByIdAndUpdate(
      id,
      { $set: sweetData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error('Failed to update sweet');
    }

    return updated;
  }

  static async deleteSweet(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid sweet ID');
    }

    const existingSweet = await SweetModel.findById(id);
    if (!existingSweet) {
      throw new Error('Sweet not found');
    }

    const deleted = await SweetModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error('Failed to delete sweet');
    }
  }
}

