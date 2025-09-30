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
exports.sendOTP = void 0;
const userModel_1 = require("../models/userModel");
const otpStore_1 = require("../utils/otpStore");
const crypto_1 = __importDefault(require("crypto"));
const sendEmails_1 = __importDefault(require("../utils/sendEmails")); // import your nodemailer function
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: 'Email is required' });
    const user = yield userModel_1.User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    // Store OTP in memory
    otpStore_1.otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes
    console.log(`OTP for ${email}: ${otp}`); // debugging
    // Prepare email content
    const htmlContent = `
    <p>Hello ${user.fullnames},</p>
    <p>Your Password Reset OTP code is: <b>${otp}</b></p>
    <p>It expires in 5 minutes.</p>
  `;
    // Send email using your mailsender function
    const mailSent = yield (0, sendEmails_1.default)(email, "Password Reset OTP", htmlContent);
    if (!mailSent) {
        return res.status(500).json({ message: "Failed to send OTP email" });
    }
    res.json({ message: "OTP sent successfully. Check your email.", otp }); // optionally include OTP for testing
});
exports.sendOTP = sendOTP;
