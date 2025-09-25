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
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // from auth middleware
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { items, totalPrice, customerName, email, address, phone, paymentMode } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }
        if (!customerName || !email || !address || !phone || !paymentMode) {
            return res.status(400).json({ message: "Missing required order information" });
        }
        const order = new OrderModel_1.default({
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
        yield order.save();
        res.status(201).json({ message: "Order created successfully", order });
    }
    catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ message: "Failed to create order", error });
    }
});
exports.createOrder = createOrder;
// Get orders for logged-in user
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const orders = yield OrderModel_1.default.find({ userId }).sort({ createdAt: -1 });
        res.json({ orders });
    }
    catch (error) {
        console.error("Fetching user orders failed:", error);
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
});
exports.getUserOrders = getUserOrders;
// Get all orders (Admin only)
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrderModel_1.default.find().sort({ createdAt: -1 });
        res.json({ orders });
    }
    catch (error) {
        console.error("Fetching all orders failed:", error);
        res.status(500).json({ message: "Failed to fetch all orders", error });
    }
});
exports.getAllOrders = getAllOrders;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status)
            return res.status(400).json({ message: "Status is required" });
        const order = yield OrderModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order status updated", order });
    }
    catch (error) {
        console.error("Updating order status failed:", error);
        res.status(500).json({ message: "Failed to update order", error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
