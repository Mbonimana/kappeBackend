import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

// Existing middleware: requireSignin
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

// Existing middleware: checkAdmin
export const checkAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.userRole !== "admin") {
    return res.status(403).json({ message: "User not Authorized" });
  }
  next();
};

// ✅ New middleware: auth
export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    await requireSignin(req, res, () => {
      // user is signed in, req.user is available
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Login required to perform this action" });
  }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        category: "AUTH_ERROR",
        message: "Authorization header missing or invalid. Use: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (!decoded || !decoded._id || !decoded.email) {
      return res.status(401).json({
        category: "AUTH_ERROR",
        message: "Invalid token payload. Missing required fields.",
      });
    }

    // Attach user info to req.user
    (req as any).user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        category: "TOKEN_EXPIRED",
        message: "Your session has expired. Please login again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        category: "INVALID_TOKEN",
        message: "Malformed or invalid token.",
      });
    }

    return res.status(500).json({
      category: "SERVER_ERROR",
      message: "Error verifying token.",
      error: err.message,
    });
  }
};