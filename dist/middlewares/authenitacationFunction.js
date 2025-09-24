"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.auth = exports.checkAdmin = exports.requireSignin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
// Existing middleware: requireSignin
const requireSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Authentication is required" });
        }
        const token = req.headers.authorization.split(" ")[1];
        const verifytoken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // 🔹 If you signed token with {_id: user._id}
        const rootuser = yield userModel_1.User.findById(verifytoken._id).select("-password");
        if (!rootuser) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = rootuser;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authorization required" });
    }
});
exports.requireSignin = requireSignin;
// Existing middleware: checkAdmin
const checkAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userRole) !== "admin") {
        return res.status(403).json({ message: "User not Authorized" });
    }
    next();
};
exports.checkAdmin = checkAdmin;
// ✅ New middleware: auth
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.requireSignin)(req, res, () => {
            // user is signed in, req.user is available
            next();
        });
    }
    catch (error) {
        return res.status(401).json({ message: "Login required to perform this action" });
    }
});
exports.auth = auth;
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                category: "AUTH_ERROR",
                message: "Authorization header missing or invalid. Use: Bearer <token>",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded._id || !decoded.email) {
            return res.status(401).json({
                category: "AUTH_ERROR",
                message: "Invalid token payload. Missing required fields.",
            });
        }
        // Attach user info to req.user
        req.user = {
            _id: decoded._id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                category: "TOKEN_EXPIRED",
                message: "Your session has expired. Please login again.",
            });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                category: "INVALID_TOKEN",
                message: "Malformed or invalid token.",
            });
        }
        return res.status(500).json({
            category: "SERVER_ERROR",
            message: "Error verifying token.",
            error: err.message,
        });
    }
};
exports.authMiddleware = authMiddleware;
