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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProducts = exports.createProduct = void 0;
const productModel_1 = require("../models/productModel");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prodName, prodPrice, ProdCat, prodDesc, productimage } = req.body;
        const newProduct = new productModel_1.Product({
            prodName,
            prodPrice,
            ProdCat,
            prodDesc,
            productimage,
        });
        const savedProduct = yield newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.Product.find(); // Fetches all products
        res.status(200).json({ message: 'Products fetched successfully', products });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.getProducts = getProducts;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProduct = yield productModel_1.Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.deleteProduct = deleteProduct;
