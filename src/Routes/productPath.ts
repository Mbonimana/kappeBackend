import upload from "../utils/multer";
import { createProduct ,getProducts,deleteProduct  } from "../controllers/productController";
import express from "express";

const uploading=upload.single('image');


const productRouter = express();
productRouter.post("/create-product", uploading, createProduct);
productRouter.get('/get-products', getProducts);
productRouter.delete('/delete-product/:id', deleteProduct);



export default productRouter;

