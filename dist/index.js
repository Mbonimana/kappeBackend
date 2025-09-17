"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const databaseConfiguration_1 = require("./config/databaseConfiguration");
const productPath_1 = __importDefault(require("./routes/productPath"));
const userPath_1 = __importDefault(require("./routes/userPath"));
const cors = require('cors');
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(cors());
app.use(express_1.default.json());
(0, databaseConfiguration_1.connectDB)();
app.use("/api/products", productPath_1.default);
app.use("/api/user", userPath_1.default);
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
