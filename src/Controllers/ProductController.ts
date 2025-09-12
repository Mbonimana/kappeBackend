// import { Request, Response } from 'express';
// import Product from '../models/Product';
// import Category from "../models/category";


// export const createProduct = async (req: Request, res: Response) => {
// try {
// const { name, category, price, discount } = req.body;
// if (!name || !category || price == null) return res.status(400).json({ message: 'name, category and price required' });


// const cat = await Category.findById(category);
// if (!cat) return res.status(400).json({ message: 'Invalid category id' });


// const prod = new Product({ name: name.trim(), category, price: Number(price), discount: discount ? Number(discount) : 0 });
// await prod.save();
// res.status(201).json(prod);
// } catch (err) {
// res.status(500).json({ message: 'Server error', error: err });
// }
// };

// export const listProducts = async (req: Request, res: Response) => {
// try {
// const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
// res.json(products);
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// };


// export const getProduct = async (req: Request, res: Response) => {
// try {
// const prod = await Product.findById(req.params.id).populate('category', 'name');
// if (!prod) return res.status(404).json({ message: 'Product not found' });
// res.json(prod);
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// };

// export const updateProduct = async (req: Request, res: Response) => {
// try {
// const { name, category, price, discount } = req.body;
// const prod = await Product.findById(req.params.id);
// if (!prod) return res.status(404).json({ message: 'Product not found' });


// if (category) {
// const cat = await Category.findById(category);
// if (!cat) return res.status(400).json({ message: 'Invalid category id' });
// prod.category = category;
// }
// if (name) prod.name = name.trim();
// if (price != null) prod.price = Number(price);
// if (discount != null) prod.discount = Number(discount);


// await prod.save();
// res.json(prod);
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// };

// export const deleteProduct = async (req: Request, res: Response) => {
// try {
// const prod = await Product.findByIdAndDelete(req.params.id);
// if (!prod) return res.status(404).json({ message: 'Product not found' });
// res.json({ message: 'Deleted' });
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// };