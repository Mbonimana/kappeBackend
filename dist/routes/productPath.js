"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("../utils/multer"));
const productController_1 = require("../controllers/productController");
const express_1 = __importDefault(require("express"));
const uploading = multer_1.default.single('image');
const productRouter = (0, express_1.default)();
productRouter.post("/create-product", uploading, productController_1.createProduct);
productRouter.get('/get-products', productController_1.getProducts);
productRouter.delete('/delete-product/:id', productController_1.deleteProduct);
exports.default = productRouter;
