"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullnames: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: Number, required: false },
    accessToken: { type: String },
    userRole: { enum: ['general_user', 'admin'], default: 'general_user', type: String },
    googleId: { type: String, unique: true, sparse: true }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
