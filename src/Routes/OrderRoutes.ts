import { Router, Express } from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/OrderController";
import { authMiddleware } from "../middlewares/authenitacationFunction";

const orderRoutes = (app: Express) => {
  const router = Router();

  // User routes
  router.post("/create", authMiddleware, createOrder);
  router.get("/my-orders", authMiddleware, getUserOrders);

  // Admin routes
  router.get("/all", getAllOrders); // you can protect with admin middleware later
  router.put("/update/:id", updateOrderStatus);

  app.use("/api/orders", router);
};

export default orderRoutes;
