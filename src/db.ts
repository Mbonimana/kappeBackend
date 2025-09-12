import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const db_user=process.env.DB_USER;
const db_name=process.env.DB_Name;
const db_pass=process.env.DB_PASS;
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@cluster0.lnavqqa.mongodb.net/${db_name}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

