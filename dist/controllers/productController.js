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
exports.deleteProduct = exports.getProducts = exports.createProduct = void 0;
const productModel_1 = require("../models/productModel");
const Cloudhandle_1 = __importDefault(require("../utils/Cloudhandle"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prodName, prodDesc, prodPrice, ProdCat, productimage } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const result = yield Cloudhandle_1.default.uploader.upload(req.file.path, {
            folder: "products"
        });
        const imageUrl = result.secure_url;
        // Create new product
        const newProduct = new productModel_1.Product({
            prodName,
            prodDesc,
            prodPrice,
            ProdCat,
            productimage: imageUrl
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
