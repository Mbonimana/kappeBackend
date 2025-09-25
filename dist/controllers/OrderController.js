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
    try {
        const { items, totalPrice, customerName, email, address, phone, paymentMode } = req.body;
        const userId = req.user.id; // from middleware
        const order = new OrderModel_1.default({
            userId,
            items,
            totalPrice,
            customerName,
            email,
            address,
            phone,
            paymentMode,
        });
        yield order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create order", error });
    }
});
exports.createOrder = createOrder;
// Get orders for logged-in user
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const orders = yield OrderModel_1.default.find({ userId }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
});
exports.getUserOrders = getUserOrders;
// Get all orders (Admin only)
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrderModel_1.default.find().sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch all orders", error });
    }
});
exports.getAllOrders = getAllOrders;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = yield OrderModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update order", error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
