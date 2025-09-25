// index.ts
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseConfiguration";
import productRouter from "./routes/productPath";
import { userRouter } from "./routes/userPath";
import cartRoutes from "./routes/CartRoutes"; // function style
import orderRoutes from "./routes/OrderRoutes";

const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // 👈 parses JSON
app.use(express.urlencoded({ extended: true })); 


connectDB();

app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




// http://localhost:5000/api/orders/checkout

// {
//   "userId": "1234567890",
//   "cartItems": [
//     {
//       "productId": "p1",
//       "title": "Test Product",
//       "price": 100,
//       "quantity": 2,
//       "image": "http://example.com/image.jpg"
//     },
//     {
//       "productId": "p2",
//       "title": "Another Product",
//       "price": 50,
//       "quantity": 1,
//       "image": "http://example.com/image2.jpg"
//     }
//   ],
//   "totalAmount": 250
// }
