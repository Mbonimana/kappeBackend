import productRouter from "./productPath"; 
import { Router } from "express";
import userRouter from "./userPath";

const mainRouter = Router();

mainRouter.use('/product', productRouter);
mainRouter.use("/user",userRouter)

export default mainRouter;