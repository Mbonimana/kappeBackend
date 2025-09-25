import { Request, Response } from "express";
import Order from "../models/OrderModel";

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // from auth middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { items, totalPrice, customerName, email, address, phone, paymentMode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    if (!customerName || !email || !address || !phone || !paymentMode) {
      return res.status(400).json({ message: "Missing required order information" });
    }

    const order = new Order({
      userId,
      items,
      totalPrice,
      customerName,
      email,
      address,
      phone,
      paymentMode,
      status: "Pending", // default status
    });

    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Get orders for logged-in user
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error("Fetching user orders failed:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error("Fetching all orders failed:", error);
    res.status(500).json({ message: "Failed to fetch all orders", error });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Updating order status failed:", error);
    res.status(500).json({ message: "Failed to update order", error });
  }
};
