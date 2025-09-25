import { Router } from "express";
import { checkout } from "../controllers/OrderController";
import { authMiddleware } from "../middlewares/authenitacationFunction";
import { getAllOrders, getUserOrders } from "../controllers/OrderController";

const router = Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/getAllOrders", getAllOrders);

// Fetch logged-in user's orders
router.get("/my-orders", authMiddleware, getUserOrders);
export default router;
