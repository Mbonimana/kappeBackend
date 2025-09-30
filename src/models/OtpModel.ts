interface OTPRecord {
  otp: string;
  expires: number;
}

const otpStore: Record<string, OTPRecord> = {};

export const saveOTP = (email: string, otp: string) => {
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes expiry
};

export const verifyOTPInStore = (email: string, otp: string): boolean => {
  const record = otpStore[email];
  if (!record) return false;
  if (Date.now() > record.expires) return false;
  return record.otp === otp;
};
