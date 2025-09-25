import { Router } from "express";
import { checkout } from "../controllers/OrderController";
import { authMiddleware } from "../middlewares/authenitacationFunction";

const router = Router();

router.post("/checkout", authMiddleware, checkout);

export default router;
