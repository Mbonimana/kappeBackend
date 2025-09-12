// import { Request, Response } from 'express';
// import Category from '../models/category';



// export const createCategory = async (req: Request, res: Response) => {
// try {
// const { name } = req.body;
// if (!name) return res.status(400).json({ message: 'Name is required' });


// const existing = await Category.findOne({ name: name.trim() });
// if (existing) return res.status(409).json({ message: 'Category already exists' });


// const cat = new Category({ name: name.trim() });
// await cat.save();
// res.status(201).json(cat);
// } catch (err) {
// res.status(500).json({ message: 'Server error', error: err });
// }
// };

// export const listCategories = async (_req: Request, res: Response) => {
// try {
// const cats = await Category.find().sort({ name: 1 });
// res.json(cats);
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// };


// export const getCategory = async (req: Request, res: Response) => {
// try {
// const cat = await Category.findById(req.params.id);
// if (!cat) return res.status(404).json({ message: 'Category not found' });
// res.json(cat);
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// };

// export const deleteCategory = async (req: Request, res: Response) => {
// try {
// const cat = await Category.findByIdAndDelete(req.params.id);
// if (!cat) return res.status(404).json({ message: 'Category not found' });
// res.json({ message: 'Deleted' });
// } catch (err) {
// res.status(500).json({ message: 'Server error' });
// }
// };