import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import categoryRoutes from "./Routes/CategoryRoutes";
import productRoutes from "./Routes/ProductRoutes";
// import cartRoutes from "./Routes/cartRoutes";
import userRoutes from "./Routes/userRoutes"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


connectDB();


app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);


app.use("/api", userRoutes );

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
