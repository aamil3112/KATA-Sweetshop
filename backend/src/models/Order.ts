import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  sweet_id: mongoose.Types.ObjectId;
  sweet_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface OrderInput {
  items: Array<{
    sweet_id: string;
    quantity: number;
  }>;
}

const OrderItemSchema = new Schema<IOrderItem>({
  sweet_id: {
    type: Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true,
  },
  sweet_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Create indexes
OrderSchema.index({ user_id: 1, created_at: -1 });
OrderSchema.index({ status: 1 });

const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;

