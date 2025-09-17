import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/databaseConfiguration";
import productRouter from "./routes/productPath";
import userRouter from "./routes/userPath";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


connectDB();
app.use("/api/products", productRouter);
app.use("/api/user",userRouter)
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
