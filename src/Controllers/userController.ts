import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../utils/tokenGenetion";

import bcryptjs from "bcryptjs";
import { get } from "http";


export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const{fullnames,email,password,userRole,phone}=req.body;

    const existingUser=await User.findOne({email});
    if(existingUser){
    return res.status(400).json({message:"User already exists"});
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