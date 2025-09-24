import mongoose from "mongoose";

export interface ICart {
  userId: string;
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
