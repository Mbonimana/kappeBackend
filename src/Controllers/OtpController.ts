import { Request, Response } from 'express';
import mailsender from '../utils/sendEmails';
import crypto from 'crypto';
import { User } from '../models/userModel';
// In-memory OTP store
const otpStore: Record<string, { otp: string; expires: number }> = {};

export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Send email
  const htmlContent = `<p>Your Password Reset OTP code is: <b>${otp}</b></p> <br>
  <h2>It expires in 5 minutes.</h2>`;
  const mailSent = await mailsender(email, 'Password Reset OTP Code', htmlContent);

  if (!mailSent) return res.status(500).json({ message: 'Failed to send OTP' });

  // Store OTP in memory
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes expiry

  res.json({ message: 'OTP sent successfully' });
};

export const verifyOTP = (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  // Check if OTP exists
  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'OTP not found' });
  if (Date.now() > record.expires) return res.status(400).json({ message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  // OTP is valid
  delete otpStore[email]; // Remove OTP after successful verification
  res.json({ message: 'OTP verified successfully' });
};
