import mongoose from "mongoose";

interface IContact extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  message: string;
}
const contactSchema = new mongoose.Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
