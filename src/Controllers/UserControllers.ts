import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../utilis/tokenGeneration"
import bcryptjs from "bcryptjs";



export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const{email,password,username,userRole}=req.body;

    const existingUser=await User.findOne({email});
    if(existingUser){
    return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword=await bcryptjs.hash(password,10);
    const newUser=new User({username,email,password:hashedPassword,userRole});
    const token=generateAccessToken(newUser);
    newUser.accessToken=token;
    await newUser.save();
    return res.status(201).json({message:"User created successfully",newUser});
    
  }
  catch(error){
return res.status(400).json({message:"Error in user signin",error});
  }

}

