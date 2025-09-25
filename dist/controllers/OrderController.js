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
exports.checkout = void 0;
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
const CartModel_1 = __importDefault(require("../models/CartModel"));
// POST /api/orders/checkout
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // userId comes from auth middleware (req.user)
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ status: "error", message: "Unauthorized" });
        }
        // find user's cart
        const cartItems = yield CartModel_1.default.find({ userId });
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Your cart is empty",
            });
        }
        // calculate total
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // create order from cart
        const order = new OrderModel_1.default({
            userId,
            items: cartItems.map((item) => ({
                productId: item.productId,
                title: item.productName,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),
            totalAmount,
            status: "pending", // set to pending until payment is confirmed
        });
        yield order.save();
        // clear cart
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
