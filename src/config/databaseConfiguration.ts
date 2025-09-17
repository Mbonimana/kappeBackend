import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;  


export const connectDB = async () => {
    try {
        const mongoUri = `mongodb+srv://doxideveloper:${db_pass}@cluster0.p5gg2nh.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`

        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables.');
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
