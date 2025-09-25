import { Request, Response } from "express";
import Order from "../models/OrderModel";
import Cart from "../models/CartModel";

// POST /api/orders/checkout
export const checkout = async (req: Request, res: Response) => {
  try {
    console.log("=== CHECKOUT CALLED ===");
    console.log("BODY RECEIVED:", req.body); // 👈 log what Render receives
    console.log("HEADERS:", req.headers);     // 👈 log headers too

    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    // ✅ Ensure body fields are parsed correctly
    const {
      customerName = "",
      email = "",
      address = "",
      phone = "",
      paymentMode = ""
    } = req.body || {};

    if (
      !customerName.trim() ||
      !email.trim() ||
      !address.trim() ||
      !phone.trim() ||
      !paymentMode.trim()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing checkout fields"
      });
    }

    // ✅ Find user's cart
    const cartItems = await Cart.find({ userId });
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Your cart is empty"
      });
    }

    // ✅ Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ Create order
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
      status: "pending",
    });

    await order.save();
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
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // populate user info (optional)
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      status: "success",
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch orders",
    });
  }
};

// ✅ Fetch logged-in user's orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error("Get user orders error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch orders",
    });
  }
};