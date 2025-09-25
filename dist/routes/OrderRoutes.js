"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const authenitacationFunction_1 = require("../middlewares/authenitacationFunction");
const orderRoutes = (app) => {
    const router = (0, express_1.Router)();
    // User routes
    router.post("/create", authenitacationFunction_1.authMiddleware, OrderController_1.createOrder);
    router.get("/my-orders", authenitacationFunction_1.authMiddleware, OrderController_1.getUserOrders);
    // Admin routes
    router.get("/all", OrderController_1.getAllOrders); // you can protect with admin middleware later
    router.put("/update/:id", OrderController_1.updateOrderStatus);
    app.use("/api/orders", router);
};
exports.default = orderRoutes;
