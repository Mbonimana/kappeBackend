// src/controllers/otpController.ts
import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { otpStore } from '../utils/otpStore';
import crypto from 'crypto';
import mailsender from '../utils/sendEmails'; // import your nodemailer function

export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP in memory
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes

  console.log(`OTP for ${email}: ${otp}`); // debugging

  // Prepare email content
  const htmlContent = `
    <p>Hello ${user.fullnames},</p>
    <p>Your Password Reset OTP code is: <b>${otp}</b></p>
    <p>It expires in 5 minutes.</p>
  `;

  // Send email using your mailsender function
  const mailSent = await mailsender(email, "Password Reset OTP", htmlContent);

  if (!mailSent) {
    return res.status(500).json({ message: "Failed to send OTP email" });
  }

  res.json({ message: "OTP sent successfully. Check your email.", otp }); // optionally include OTP for testing
};
