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
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authentication is required" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const verifytoken: any = jwt.verify(token, JWT_SECRET);

    // 🔹 If you signed token with {_id: user._id}
    const rootuser = await User.findById(verifytoken._id).select("-password");

    if (!rootuser) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = rootuser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authorization required" });
  }
};

export const checkAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.userRole !== "admin") {
    return res.status(403).json({ message: "User not Authorized" });
  }
  next();
};
