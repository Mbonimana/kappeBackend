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
const cors = require("cors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(cors());
(0, databaseConfiguration_1.connectDB)();
app.use("/api/products", productPath_1.default);
app.use("/api/user", userPath_1.userRouter);
app.use("/api/cart", CartRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
