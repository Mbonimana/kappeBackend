"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const authenitacationFunction_1 = require("../middlewares/authenitacationFunction");
const OrderController_2 = require("../controllers/OrderController");
const router = (0, express_1.Router)();
router.post("/checkout", authenitacationFunction_1.authMiddleware, OrderController_1.checkout);
router.get("/getAllOrders", OrderController_2.getAllOrders);
// Fetch logged-in user's orders
router.get("/my-orders", authenitacationFunction_1.authMiddleware, OrderController_2.getUserOrders);
exports.default = router;
