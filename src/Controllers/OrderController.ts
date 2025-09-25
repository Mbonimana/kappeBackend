import { Request, Response } from "express";
import Order from "../models/OrderModel";

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalPrice, customerName, email, address, phone, paymentMode } = req.body;
    const userId = (req as any).user.id; // from middleware

    const order = new Order({
      userId,
      items,
      totalPrice,
      customerName,
      email,
      address,
      phone,
      paymentMode,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Get orders for logged-in user
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
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

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};
