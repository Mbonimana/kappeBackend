import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { IUser, User } from "../models/userModel";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Ensure email exists
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        // Find existing user
        let user = await User.findOne({ email });

        // If user does not exist, create it
        if (!user) {
          const token = jwt.sign(
            { email, role: "general_user" },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
          );

          try {
            user = await User.create({
              fullnames: profile.displayName || "No Name",
              email,
              password: "",
              phone: 0,
              userRole: "general_user",
              accessToken: token,
              googleId: profile.id,
            });
            console.log("New user created:", user);
          } catch (err) {
            console.error("Error creating user in MongoDB:", err);
            return done(err as any);
          }
        }

        // If user exists but has no accessToken, generate one
        if (user && !user.accessToken) {
          const token = jwt.sign(
            { email: user.email, role: user.userRole },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
          );
          user.accessToken = token;
          await user.save();
        }

        // Done
        done(null, user);
      } catch (err) {
        console.error("Passport GoogleStrategy error:", err);
        done(err as any);
      }
    }
  )
);

// No sessions used (stateless JWT)
passport.serializeUser(() => {});
passport.deserializeUser(() => {});
