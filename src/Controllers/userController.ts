import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../utils/tokenGenetion";
import { otpStore } from '../utils/otpStore';
import bcryptjs from "bcryptjs";
import { get } from "http";
import mailsender from "../utils/sendEmails";


export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const{fullnames,email,password,userRole,phone}=req.body;

    const existingUser=await User.findOne({email});
    if(existingUser){
    return res.status(400).json({message:"Email  exists"});
    }
    const hashedPassword=await bcryptjs.hash(password,10);
    const newUser=new User({fullnames,email,password:hashedPassword,userRole,phone});
    const token=generateAccessToken(newUser);
    newUser.accessToken=token;
    await newUser.save();
    return res.status(201).json({message:"User created successfully",newUser});
    
  }
  catch(error){
return res.status(400).json({message:"Error in user signin",error});
  }

}

export const login=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const{email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(!existingUser){
      return res.status(400).json({message:"User not found,please register"});
    }         
    const isPasswordMatched=await bcryptjs.compare(password,existingUser.password);
    if(!isPasswordMatched){
      return res.status(400).json({message:"Invalid credentials"});
    }   
                
    const token=generateAccessToken(existingUser);
    existingUser.accessToken=token;
    await existingUser.save();
    return res.status(200).json({message:"successfully Logedin",existingUser});  

  }
  catch(error){
    return res.status(400).json({message:"Error in user login",error});
  }
}

export const getAllUsers=async(req:Request,res:Response,next:NextFunction)=>{
  try{
    const users=await User.find();
    return res.status(200).json({message:"Users listed successfully",users});
  }catch(error){
    return res.status(400).json({message:"Error in listing users",error});
  }
}

export const resetPasswordWithOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // OTP verification
    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (Date.now() > record.expires) return res.status(400).json({ message: "OTP expired" });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // Remove OTP after verification
    delete otpStore[email];

    // Reset password
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    // Send confirmation email
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333333; text-align: center;">Password Changed Successfully</h2>
    <p style="color: #555555; font-size: 16px;">
      Hello <strong>${user.fullnames}</strong>,
    </p>
    <p style="color: #555555; font-size: 16px;">
      Your password has been successfully changed. If you did not perform this action, please contact our support team immediately.
    </p>
    <p style="color: #555555; font-size: 16px;">
      <strong>Support Email:</strong> support@work-kappe-ui.vercel.app
    </p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://work-kappe-ui.vercel.app/Login" style="background-color: #FFA500; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
        Login to Your Account
      </a>
    </div>
    <p style="color: #999999; font-size: 12px; text-align: center; margin-top: 20px;">
      © ${new Date().getFullYear()} Kapee UI by Manasseh . All rights reserved.
    </p>
  </div>
`;

    const mailSent = await mailsender(email, "Password Changed Successfully", htmlContent);
    if (!mailSent) {
      console.warn(`Password reset email could not be sent to ${email}`);
    }

    res.status(200).json({ message: "Password reset successfully." });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error });
  }
};