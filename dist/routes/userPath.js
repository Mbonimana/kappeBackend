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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const authenitacationFunction_1 = require("../middlewares/authenitacationFunction");
const OtpController_1 = require("../controllers/OtpController");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post("/userRegistration", userController_1.SignUp);
userRouter.post("/userLogin", userController_1.login);
userRouter.get("/getAllUsers", userController_1.getAllUsers);
userRouter.post('/send-otp', OtpController_1.sendOTP);
userRouter.post("/reset-password", userController_1.resetPasswordWithOTP);
// Example: GET /api/user/me
userRouter.get("/me", authenitacationFunction_1.requireSignin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ user: req.user });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}));
