"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrders = exports.createOrder = void 0;
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
// Create new order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure authenticated user
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
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
        const order = new OrderModel_1.default({
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
        const savedOrder = yield order.save();
        res.status(201).json({ status: "success", message: "Order created successfully", order: savedOrder });
    }
    catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ status: "error", message: "Failed to create order", error: error.message });
    }
});
exports.createOrder = createOrder;
// Get orders for logged-in user
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ status: "error", message: "Unauthorized. User not logged in." });
        }
        const orders = yield OrderModel_1.default.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ status: "success", orders });
    }
    catch (error) {
        console.error("Fetch user orders error:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch user orders", error: error.message });
    }
});
exports.getUserOrders = getUserOrders;
// Get all orders (Admin only)
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ status: "error", message: "Unauthorized. Admin access required." });
        }
        const orders = yield OrderModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ status: "success", orders });
    }
    catch (error) {
        console.error("Fetch all orders error:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch all orders", error: error.message });
    }
});
exports.getAllOrders = getAllOrders;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id) {
            return res.status(400).json({ status: "error", message: "Order ID is required" });
        }
        if (!status) {
            return res.status(400).json({ status: "error", message: "Order status is required" });
        }
        const order = yield OrderModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!order)
            return res.status(404).json({ status: "error", message: "Order not found" });
        res.status(200).json({ status: "success", message: "Order status updated", order });
    }
    catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ status: "error", message: "Failed to update order", error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
