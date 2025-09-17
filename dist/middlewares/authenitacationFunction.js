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
exports.checkAdmin = exports.requireSignin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
const requireSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const verifytoken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const rootuser = yield userModel_1.User.findOne({
                _id: verifytoken._id,
                accessToken: token,
            });
            if (!rootuser) {
                throw "User not found";
            }
            req.user = rootuser;
            next();
        }
        else {
            throw "Authentication is required";
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Authorization required" });
    }
});
exports.requireSignin = requireSignin;
const checkAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.useRole) !== "admin") {
        return res.status(401).json({ message: "User not Authorized" });
    }
    next();
};
exports.checkAdmin = checkAdmin;
