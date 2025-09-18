import { Product } from "../models/productModel";
import { Request, Response } from "express";


export const createProduct=async(req:Request,res:Response)=>{
    try{
        const {prodName,prodPrice,ProdCat,prodDesc,productimage}=req.body;
        const newProduct=new Product({
            prodName,
            prodPrice,
            ProdCat,
            prodDesc,
            productimage,
           
            
        });
        const savedProduct=await newProduct.save();
        res.status(201).json({message:'Product created successfully',product:savedProduct});
    }
    catch(error){
        res.status(500).json({message:'Server Error',error});
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
    