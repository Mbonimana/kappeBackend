import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IProduct extends Document {
name: string;
category: Types.ObjectId;
price: number;
discount?: number; // percentage 0-100
}


const ProductSchema: Schema = new Schema({
name: { type: String, required: true, trim: true },
category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
price: { type: Number, required: true, min: 0 },
discount: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

