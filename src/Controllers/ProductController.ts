import { Product } from "../models/productModel";
import { Request, Response } from "express";
import cloudinary from "../utils/Cloudhandle";
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { prodName, prodDesc, prodPrice, ProdCat ,productimage} = req.body;

    //      prodName:string;
    // prodDesc:string;
    // prodPrice: number;
    // ProdCat:string;
    // productimage:string;
    
        if(!req.file){
            return res.status(400).json({message:"No image uploaded"})
        }
        const result=await cloudinary.uploader.upload(req.file.path,{
            folder:"products"
        });
        const imageUrl=result.secure_url;
        // Create new product
        const newProduct = new Product({
            prodName,
            prodDesc,
            prodPrice,
            ProdCat,
            productimage:imageUrl
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: savedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find(); // Fetches all products
        res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
    