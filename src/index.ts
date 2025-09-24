// index.ts
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseConfiguration";
import productRouter from "./routes/productPath";
import { userRouter } from "./routes/userPath";
import cartRoutes from "./routes/CartRoutes"; // function style
import { auth } from "./middlewares/authenitacationFunction";
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRoutes, auth); // function style


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
