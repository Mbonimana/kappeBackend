import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  totalPrice: number;
  customerName: string;
  email: string;
  address: string;
  phone: string;
  paymentMode: "CASH_ON_DELIVERY" | "MOBILE_MONEY" | "CARD";
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    totalPrice: { type: Number, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMode: {
      type: String,
      enum: ["CASH_ON_DELIVERY", "MOBILE_MONEY", "CARD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
