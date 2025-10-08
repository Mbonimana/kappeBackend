import nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD, // 16-char app password
  
  },
});

const mailsender = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_NAME,
      to,
      subject,
      html: htmlContent,
      
    });
    console.log("Email Successfully Sent");
    return true;
  } catch (error: any) {
    console.error("Sending Mail Error", error);
    return false;
  }
};

export default mailsender;
