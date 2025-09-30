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
exports.resetPasswordWithOTP = exports.getAllUsers = exports.login = exports.SignUp = void 0;
const userModel_1 = require("../models/userModel");
const tokenGenetion_1 = require("../utils/tokenGenetion");
const otpStore_1 = require("../utils/otpStore");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendEmails_1 = __importDefault(require("../utils/sendEmails"));
const SignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullnames, email, password, userRole, phone } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email  exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.User({ fullnames, email, password: hashedPassword, userRole, phone });
        const token = (0, tokenGenetion_1.generateAccessToken)(newUser);
        newUser.accessToken = token;
        yield newUser.save();
        return res.status(201).json({ message: "User created successfully", newUser });
    }
    catch (error) {
        return res.status(400).json({ message: "Error in user signin", error });
    }
});
exports.SignUp = SignUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield userModel_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found,please register" });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = (0, tokenGenetion_1.generateAccessToken)(existingUser);
        existingUser.accessToken = token;
        yield existingUser.save();
        return res.status(200).json({ message: "successfully Logedin", existingUser });
    }
    catch (error) {
        return res.status(400).json({ message: "Error in user login", error });
    }
});
exports.login = login;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.User.find();
        return res.status(200).json({ message: "Users listed successfully", users });
    }
    catch (error) {
        return res.status(400).json({ message: "Error in listing users", error });
    }
});
exports.getAllUsers = getAllUsers;
const resetPasswordWithOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;
        if (!email || !otp || !newPassword || !confirmPassword)
            return res.status(400).json({ message: "All fields are required" });
        if (newPassword !== confirmPassword)
            return res.status(400).json({ message: "Passwords do not match" });
        // OTP verification
        const record = otpStore_1.otpStore[email];
        if (!record)
            return res.status(400).json({ message: "OTP not found" });
        if (Date.now() > record.expires)
            return res.status(400).json({ message: "OTP expired" });
        if (record.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });
        // Remove OTP after verification
        delete otpStore_1.otpStore[email];
        // Reset password
        const user = yield userModel_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.password = yield bcryptjs_1.default.hash(newPassword, 10);
        yield user.save();
        // Send confirmation email
        const htmlContent = `
      <p>Hello ${user.fullnames},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you did not perform this action, please contact support immediately.</p>
    `;
        const mailSent = yield (0, sendEmails_1.default)(email, "Password Changed Successfully", htmlContent);
        if (!mailSent) {
            console.warn(`Password reset email could not be sent to ${email}`);
        }
        res.status(200).json({ message: "Password reset successfully." });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password", error });
    }
});
exports.resetPasswordWithOTP = resetPasswordWithOTP;
