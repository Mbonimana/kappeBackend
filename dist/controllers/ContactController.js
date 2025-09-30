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
exports.createContact = void 0;
const ContactModel_1 = require("../models/ContactModel");
const sendEmails_1 = __importDefault(require("../utils/sendEmails"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Save contact in DB
        const newContact = new ContactModel_1.Contact({ name, email, phone, message });
        yield newContact.save();
        const adminEmail = process.env.ADMIN_EMAIL;
        // Notify admin
        if (adminEmail) {
            yield (0, sendEmails_1.default)(adminEmail, "New Contact Message", `<h3>Task Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>`);
        }
        // Send confirmation to user
        yield (0, sendEmails_1.default)(email, "Thank you for contacting us", `<h3>Hello ${name}</h3>
      <h3>Thank you for contacting us</h3>
      <p>Our team will get back to you shortly.</p>
      <p><strong>KLab Team</strong></p>`);
        res.status(201).json({
            message: "Contact message received, Confirmation email sent",
            contact: newContact,
        });
    }
    catch (error) {
        console.error("Create Contact Error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createContact = createContact;
