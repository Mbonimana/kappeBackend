import productRouter from "./productPath"; 
import { Router } from "express";
import { userRouter } from "./userPath";
import cartRoutes from "./CartRoutes";

const mainRouter = Router();

mainRouter.use('/product', productRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/cart", cartRoutes,);


export default mainRouter;