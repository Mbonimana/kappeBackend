"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure email exists
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(new Error("No email found in Google profile"));
        }
        // Find existing user
        let user = yield userModel_1.User.findOne({ email });
        // If user does not exist, create it
        if (!user) {
            const token = jsonwebtoken_1.default.sign({ email, role: "general_user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
            try {
                user = yield userModel_1.User.create({
                    fullnames: profile.displayName || "No Name",
                    email,
                    password: "",
                    phone: 0,
                    userRole: "general_user",
                    accessToken: token,
                    googleId: profile.id,
                });
                console.log("New user created:", user);
            }
            catch (err) {
                console.error("Error creating user in MongoDB:", err);
                return done(err);
            }
        }
        // If user exists but has no accessToken, generate one
        if (user && !user.accessToken) {
            const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.userRole }, process.env.JWT_SECRET, { expiresIn: "7d" });
            user.accessToken = token;
            yield user.save();
        }
        // Done
        done(null, user);
    }
    catch (err) {
        console.error("Passport GoogleStrategy error:", err);
        done(err);
    }
})));
// No sessions used (stateless JWT)
passport_1.default.serializeUser(() => { });
passport_1.default.deserializeUser(() => { });
