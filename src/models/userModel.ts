import { Schema,Document,model } from "mongoose";

export interface IUser extends Document {
    fullnames: string;
    email: string;
    password: string;
    phone: number;
    accessToken: string;
    userRole: string;
}

const userSchema = new Schema<IUser>({
    fullnames: { type: String, required:false},  
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: false },
    accessToken: { type: String },
    userRole: { enum: ['general_user', 'admin'], default: 'general_user', type: String }
}, { timestamps: true });


export const User = model<IUser>('User', userSchema);