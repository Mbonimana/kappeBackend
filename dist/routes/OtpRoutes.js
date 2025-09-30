"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OtpController_1 = require("../controllers/OtpController");
const router = express_1.default.Router();
router.post('/send-otp', OtpController_1.sendOTP);
// router.post('/verify-otp', verifyOTP);
exports.default = router;
