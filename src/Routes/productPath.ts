import { createProduct ,getProducts,deleteProduct  } from "../controllers/productController";

import express from "express";

const productRouter = express();
productRouter.post('/create-product', createProduct);
productRouter.get('/get-products', getProducts);
productRouter.delete('/delete-product/:id', deleteProduct);



export default productRouter;

