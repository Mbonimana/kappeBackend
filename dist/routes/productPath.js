"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productController_1 = require("../controllers/productController");
const express_1 = __importDefault(require("express"));
const productRouter = (0, express_1.default)();
productRouter.post('/create-product', productController_1.createProduct);
productRouter.get('/get-products', productController_1.getProducts);
exports.default = productRouter;
