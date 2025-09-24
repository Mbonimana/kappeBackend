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
exports.clearCart = exports.removeFromCart = exports.updateQuantity = exports.getCartByUser = exports.addToCart = void 0;
const CartModel_1 = __importDefault(require("../models/CartModel"));
const productModel_1 = require("../models/productModel");
// ✅ Add product to cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({
                message: "Login required to add to cart",
            });
        }
        const { productId, quantity } = req.body;
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
            });
        }
        const product = yield productModel_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        let item = yield CartModel_1.default.findOne({ userId: user._id, productId });
        if (item) {
            item.quantity += quantity || 1;
            yield item.save();
        }
        else {
            item = yield CartModel_1.default.create({
                userId: user._id,
                productId,
                productName: product.prodName,
                price: product.prodPrice,
                image: product.productimage,
                quantity: quantity || 1,
            });
        }
        res.status(200).json({
            message: "Item added to cart",
            cartItem: item,
        });
    }
    catch (err) {
        res.status(500).json({
            category: "SERVER_ERROR",
            message: "Error adding to cart",
            error: err.message,
        });
    }
});
exports.addToCart = addToCart;
// ✅ Get cart for logged-in user
const getCartByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({
                message: "First login to view cart",
            });
        }
        const cartItems = yield CartModel_1.default.find({ userId: user._id });
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({
                message: "empty cart",
            });
        }
        res.status(200).json({
            message: "Cart listed successfully",
            cart: cartItems,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching cart",
            error: err.message,
        });
    }
});
exports.getCartByUser = getCartByUser;
// ✅ Update quantity of a cart item
const updateQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be greater than 0",
            });
        }
        const item = yield CartModel_1.default.findById(id);
        if (!item) {
            return res.status(404).json({
                message: "Cart item not found",
            });
        }
        item.quantity = quantity;
        yield item.save();
        res.status(200).json({
            category: "SUCCESS",
            message: "Cart item updated successfully",
            updatedItem: item,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error updating cart item",
            error: err.message,
        });
    }
});
exports.updateQuantity = updateQuantity;
//  Remove a single cart item
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield CartModel_1.default.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({
                category: "NOT_FOUND",
                message: "Cart item not found",
            });
        }
        res.status(200).json({
            message: "Cart Product removed",
        });
    }
    catch (err) {
        res.status(500).json({
            category: "SERVER_ERROR",
            message: "Error removing product from cart",
            error: err.message,
        });
    }
});
exports.removeFromCart = removeFromCart;
//  Clear all items in logged-in user’s cart
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({
                message: "Login required to clear cart",
            });
        }
        yield CartModel_1.default.deleteMany({ userId: user._id });
        res.status(200).json({
            message: "Cart cleared successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error clearing cart",
            error: err.message,
        });
    }
});
exports.clearCart = clearCart;
