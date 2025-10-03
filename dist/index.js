"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const databaseConfiguration_1 = require("./config/databaseConfiguration");
const productPath_1 = __importDefault(require("./routes/productPath"));
const userPath_1 = require("./routes/userPath");
const CartRoutes_1 = __importDefault(require("./routes/CartRoutes")); // function style
const OrderRoutes_1 = __importDefault(require("./routes/OrderRoutes"));
const ContactRoutes_1 = __importDefault(require("./routes/ContactRoutes"));
const swagger_1 = require("./swagger");
const cors = require("cors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express_1.default.json()); // 👈 parses JSON
app.use(express_1.default.urlencoded({ extended: true }));
(0, databaseConfiguration_1.connectDB)();
app.use("/api/products", productPath_1.default);
app.use("/api/user", userPath_1.userRouter);
app.use("/api/cart", CartRoutes_1.default);
app.use("/api/orders", OrderRoutes_1.default);
app.use("/api/contact", ContactRoutes_1.default);
app.use("/api-docs", swagger_1.swaggerUI.serve, swagger_1.swaggerUI.setup(swagger_1.swaggerSpec));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
