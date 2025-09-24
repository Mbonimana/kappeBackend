import { Router } from "express";
import { addToCart, getCartByUser, updateQuantity, removeFromCart, clearCart } from "../controllers/CartController";
import { authMiddleware } from "../middlewares/authenitacationFunction";

const router = Router();

router.post("/addtoCart", authMiddleware, addToCart);
router.get("/getCartByUser/:userId", authMiddleware, getCartByUser);
router.put("/updatecartquantity/:id", authMiddleware, updateQuantity);
router.delete("/deleteProduct/:id", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
