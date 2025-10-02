import express from 'express';
import { connectDB } from './config/databaseConfiguration';
import mainRouter from './routes/indexRouting';
import { swaggerSpec, swaggerUI } from "./swagger";



import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
connectDB();
app.listen(port, () => {
    console.log(`the server is running:http://localhost:${port}`);

})
app.get("/test", (req, res) => res.send("Server is working"));
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
// app.use(cors(corsOptions));
app.use(express.json());
app.use("/api_v1", mainRouter)



