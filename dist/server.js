"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const databaseConfiguration_1 = require("./config/databaseConfiguration");
const indexRouting_1 = __importDefault(require("./routes/indexRouting"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, databaseConfiguration_1.connectDB)();
app.listen(port, () => {
    console.log(`the server is running:http://localhost:${port}`);
});
app.get("/test", (req, res) => res.send("Server is working"));
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
// app.use(cors(corsOptions));
app.use(express_1.default.json());
app.use("/api_v1", indexRouting_1.default);
