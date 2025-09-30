import { Contact } from "../models/ContactModel";
import { Request, Response } from "express";
import  mailsender from "../utils/sendEmails";
import dotenv from "dotenv";

dotenv.config();

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save contact in DB
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    const adminEmail = process.env.ADMIN_EMAIL;

    // Notify admin
    if (adminEmail) {
      await mailsender(
        adminEmail,
        "New Contact Message",
        `<h3>Task Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>`
      );
    }
    // Send confirmation to user

    await mailsender(
      email,
      "Thank you for contacting us",
      `<h3>Hello ${name}</h3>
      <h3>Thank you for contacting us</h3>
      <p>Our team will get back to you shortly.</p>
      <p><strong>KLab Team</strong></p>`
    );

    
    res.status(201).json({
      message: "Contact message received, Confirmation email sent",
      contact: newContact,
    });
  } catch (error) {
    console.error("Create Contact Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};