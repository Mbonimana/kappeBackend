import { createProduct ,getProducts  } from "../controllers/productController";

import express from "express";

const productRouter = express();
productRouter.post('/create-product', createProduct);
productRouter.get('/get-products', getProducts);



export default productRouter;

