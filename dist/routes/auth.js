"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authRouter = (0, express_1.Router)();
// Google login start
authRouter.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Google callback (JWT only, no sessions)
authRouter.get("/google/callback", passport_1.default.authenticate("google", { session: false, failureRedirect: "/auth/login/failed" }), (req, res) => {
    const user = req.user; // type assertion
    if (!user || !user.accessToken) {
        return res.status(500).json({ success: false, message: "User or token missing" });
    }
    // send JWT to frontend via query param or JSON
    res.redirect(`${process.env.CLIENT_URL}?token=${user.accessToken}`);
});
// Login failed
authRouter.get("/login/failed", (req, res) => {
    res.status(401).json({ success: false, message: "Login failed" });
});
exports.default = authRouter;
