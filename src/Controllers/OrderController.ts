import { Request, Response } from "express";
import Order from "../models/OrderModel";

// Create new order
export const createOrder = async (req: any, res: Response) => {
  try {
    const { items, totalPrice, customerName, email, address, phone, paymentMode } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate cart items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or invalid" });
    }

    // Validate required fields
    if (!totalPrice || !customerName || !email || !address || !phone || !paymentMode) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      totalPrice,
      customerName,
      email,
      address,
      phone,
      paymentMode,
      status: "Pending",
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Get orders for logged-in user
export const getUserOrders = async (req: any, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ message: "Failed to fetch all orders", error });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order", error });
  }
};
