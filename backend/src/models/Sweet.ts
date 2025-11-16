import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SweetInput {
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface SweetUpdate {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image?: string;
  description?: string;
}

const SweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Create indexes for faster searches
SweetSchema.index({ name: 1 });
SweetSchema.index({ category: 1 });
SweetSchema.index({ price: 1 });

const SweetModel = mongoose.model<ISweet>('Sweet', SweetSchema);

export default SweetModel;

