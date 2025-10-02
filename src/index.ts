// index.ts
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseConfiguration";
import productRouter from "./routes/productPath";
import { userRouter } from "./routes/userPath";
import cartRoutes from "./routes/CartRoutes"; // function style
import orderRoutes from "./routes/OrderRoutes";
import contactRouter from "./routes/ContactRoutes";
import { swaggerSpec, swaggerUI } from "./swagger";

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
app.use("/api/contact", contactRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




