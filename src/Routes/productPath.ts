import { createProduct ,getProducts  } from "../controllers/productController";

import express from "express";

const productRouter = express();
productRouter.post('/create-product', createProduct);



export default productRouter;

