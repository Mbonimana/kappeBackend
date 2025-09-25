"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const authenitacationFunction_1 = require("../middlewares/authenitacationFunction");
const router = (0, express_1.Router)();
router.post("/checkout", authenitacationFunction_1.authMiddleware, OrderController_1.checkout);
exports.default = router;
