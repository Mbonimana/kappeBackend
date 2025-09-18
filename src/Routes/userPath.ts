import { SignUp } from "../controllers/userController";
import { login } from "../controllers/userController";
import { getAllUsers } from "../controllers/userController";
import express from "express";
const userRouter=express();
userRouter.post("/userRegistration",SignUp);
userRouter.post("/userLogin",login);
userRouter.get("/getAllUsers",getAllUsers);


export default userRouter;