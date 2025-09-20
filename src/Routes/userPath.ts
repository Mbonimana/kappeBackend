import { SignUp, login, getAllUsers } from "../controllers/userController";
import express from "express";
import { requireSignin } from "../middlewares/authenitacationFunction";

const userRouter = express.Router();

userRouter.post("/userRegistration", SignUp);
userRouter.post("/userLogin", login);
userRouter.get("/getAllUsers", getAllUsers);

// Example: GET /api/user/me
userRouter.get("/me", requireSignin, async (req: any, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export { userRouter };   // ✅ named export
