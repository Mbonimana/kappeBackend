import { Router, Request, Response } from "express";
import passport from "passport";
import { IUser } from "../models/userModel";

declare global {
  namespace Express {
    interface User extends IUser {} // now req.user is typed as IUser
  }
}
const authRouter = Router();

// Google login start
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback (JWT only, no sessions)
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/login/failed" }),
  (req: Request, res: Response) => {
    const user = req.user as IUser; // type assertion

    if (!user || !user.accessToken) {
      return res.status(500).json({ success: false, message: "User or token missing" });
    }

    // send JWT to frontend via query param or JSON
    res.redirect(`${process.env.CLIENT_URL}?token=${user.accessToken}`);
  }
);

// Login failed
authRouter.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: "Login failed" });
});

export default authRouter;
