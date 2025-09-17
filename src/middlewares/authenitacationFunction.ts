import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const requireSignin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {

      const token = req.headers.authorization.split(" ")[1];
      const verifytoken: any = jwt.verify(token, JWT_SECRET);
      const rootuser = await User.findOne({
        _id: verifytoken._id,
        accessToken: token,
      });
      if (!rootuser) {
        throw "User not found";
      }
      req.user = rootuser;
      next();
    } else {
      throw "Authentication is required";
    }
  } catch (error) {
    return res.status(401).json({ message: "Authorization required" });
  }
};

export const checkAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.useRole !== "admin") {
    return res.status(401).json({ message: "User not Authorized" });
  }
  next();
};