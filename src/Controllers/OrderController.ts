import { Request, Response } from "express";
import Order from "../models/OrderModel";

// Create new order
export const createOrder = async (req: any, res: Response) => {
  try {
    // Ensure authenticated user
    if (!req.user?._id) {
      return res.status(401).json({ status: "error", message: "Unauthorized. User not logged in." });
    }

    const { items, totalPrice, customerName, email, address, phone, paymentMode } = req.body;

    // Validate cart items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: "error", message: "Cart is empty or invalid" });
    }

    // Validate required fields
    if (!totalPrice || !customerName || !email || !address || !phone || !paymentMode) {
      return res.status(400).json({ status: "error", message: "Missing required order fields" });
    }

    // Create order
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

    const savedOrder = await order.save();
    res.status(201).json({ status: "success", message: "Order created successfully", order: savedOrder });
  } catch (error: any) {
    console.error("Order creation error:", error);
    res.status(500).json({ status: "error", message: "Failed to create order", error: error.message });
  }
};

// Get orders for logged-in user
export const getUserOrders = async (req: any, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ status: "error", message: "Unauthorized. User not logged in." });
    }

    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", orders });
  } catch (error: any) {
    console.error("Fetch user orders error:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch user orders", error: error.message });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req: any, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ status: "error", message: "Unauthorized. Admin access required." });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", orders });
  } catch (error: any) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch all orders", error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ status: "error", message: "Order ID is required" });
    }

    if (!status) {
      return res.status(400).json({ status: "error", message: "Order status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ status: "error", message: "Order not found" });

    res.status(200).json({ status: "success", message: "Order status updated", order });
  } catch (error: any) {
    console.error("Update order status error:", error);
    res.status(500).json({ status: "error", message: "Failed to update order", error: error.message });
  }
};
