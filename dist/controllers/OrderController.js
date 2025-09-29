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
exports.getUserOrders = exports.getAllOrders = exports.checkout = void 0;
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
const CartModel_1 = __importDefault(require("../models/CartModel"));
// POST /api/orders/checkout
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("=== CHECKOUT CALLED ===");
        console.log("BODY RECEIVED:", req.body); // 👈 log what Render receives
        console.log("HEADERS:", req.headers); // 👈 log headers too
        const user = req.user;
        const userId = user === null || user === void 0 ? void 0 : user._id;
        if (!userId) {
            return res.status(401).json({ status: "error", message: "Unauthorized" });
        }
        // ✅ Ensure body fields are parsed correctly
        const { customerName = "", email = "", address = "", phone = "", paymentMode = "" } = req.body || {};
        if (!customerName.trim() ||
            !email.trim() ||
            !address.trim() ||
            !phone.trim() ||
            !paymentMode.trim()) {
            return res.status(400).json({
                status: "error",
                message: "Missing checkout fields"
            });
        }
        // ✅ Find user's cart
        const cartItems = yield CartModel_1.default.find({ userId });
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Your cart is empty"
            });
        }
        // ✅ Calculate total
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // ✅ Create order
        const order = new OrderModel_1.default({
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
            status: "Paid",
        });
        yield order.save();
        yield CartModel_1.default.deleteMany({ userId });
        return res.status(201).json({
            status: "success",
            message: "Order placed successfully",
            order,
        });
    }
    catch (error) {
        console.error("Checkout error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Failed to place order",
        });
    }
});
exports.checkout = checkout;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrderModel_1.default.find()
            .populate("user", "name email") // populate user info (optional)
            .sort({ createdAt: -1 }); // latest first
        return res.status(200).json({
            status: "success",
            count: orders.length,
            orders,
        });
    }
    catch (error) {
        console.error("Get orders error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Failed to fetch orders",
        });
    }
});
exports.getAllOrders = getAllOrders;
// ✅ Fetch logged-in user's orders
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user === null || user === void 0 ? void 0 : user._id;
        if (!userId) {
            return res.status(401).json({ status: "error", message: "Unauthorized" });
        }
        const orders = yield OrderModel_1.default.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            status: "success",
            count: orders.length,
            orders,
        });
    }
    catch (error) {
        console.error("Get user orders error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Failed to fetch orders",
        });
    }
});
exports.getUserOrders = getUserOrders;
