import { Request, Response } from "express";
import Order from "../models/OrderModel";
import Cart from "../models/CartModel";

// POST /api/orders/checkout
export const checkout = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    // find user's cart
    const cartItems = await Cart.find({ userId });
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ status: "error", message: "Your cart is empty" });
    }

    // calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // get checkout form fields from request body
    const { customerName, email, address, phone, paymentMode } = req.body;
    if (!customerName || !email || !address || !phone || !paymentMode) {
      return res.status(400).json({ status: "error", message: "Missing checkout fields" });
    }

    // create order from cart + form data
    const order = new Order({
      user: userId,
      items: cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        title: item.productName,
        price: item.price,
        image: item.image,
      })),
      totalPrice: totalAmount,
      customerName,
      email,
      address,
      phone,
      paymentMode,
      status: "pending", // pending until payment is confirmed
    });

    await order.save();

    // clear cart
    await Cart.deleteMany({ userId });

    return res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      order,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to place order",
    });
  }
};
