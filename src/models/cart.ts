import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface ICart extends Document {
  items: ICartItem[];
  totalQty: number;
  totalPrice: number;
  createdAt: Date;
}

const CartItemSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const CartSchema: Schema = new Schema(
  {
    items: { type: [CartItemSchema], default: [] },
    totalQty: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// 🔄 Middleware to recalc totals before saving
CartSchema.pre<ICart>('save', function (next) {
  this.totalQty = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export default mongoose.model<ICart>('Cart', CartSchema);
