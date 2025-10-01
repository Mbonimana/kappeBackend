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
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333333; text-align: center;">Password Reset OTP</h2>
    <p style="color: #555555; font-size: 16px;">
      Hello <strong>${user.fullnames}</strong>,
    </p>
    <p style="color: #555555; font-size: 16px;">
      Your Password Reset OTP code is:
      <span style="display: inline-block; background-color: #FFA500; color: #ffffff; font-weight: bold; padding: 5px 10px; border-radius: 5px; margin-top: 5px;">
        ${otp}
      </span>
    </p>
    <p style="color: #555555; font-size: 14px; margin-top: 10px;">
      This OTP will expire in 5 minutes. Please use it as soon as possible.
    </p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://yourdomain.com/login" style="background-color: #FFA500; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
        Go to Login
      </a>
    </div>
    <p style="color: #999999; font-size: 12px; text-align: center; margin-top: 20px;">
      © ${new Date().getFullYear()} Your Company Name. All rights reserved.
    </p>
  </div>
`;


  // Send email using your mailsender function
  const mailSent = await mailsender(email, "Password Reset OTP", htmlContent);

  if (!mailSent) {
    return res.status(500).json({ message: "Failed to send OTP email" });
  }

  res.json({ message: "OTP sent successfully. Check your email.", otp }); // optionally include OTP for testing
};
