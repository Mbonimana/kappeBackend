"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPInStore = exports.saveOTP = void 0;
const otpStore = {};
const saveOTP = (email, otp) => {
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes expiry
};
exports.saveOTP = saveOTP;
const verifyOTPInStore = (email, otp) => {
    const record = otpStore[email];
    if (!record)
        return false;
    if (Date.now() > record.expires)
        return false;
    return record.otp === otp;
};
exports.verifyOTPInStore = verifyOTPInStore;
