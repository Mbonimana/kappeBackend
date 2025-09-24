import { Request, Response } from "express";
import Cart from "../models/CartModel";
import { Product } from "../models/productModel";

// ✅ Add product to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        
        message: "Login required to add to cart",
      });
    }

    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        
        message: "Product not found",
      });
    }

    let item = await Cart.findOne({ userId: user._id, productId });

    if (item) {
      item.quantity += quantity || 1;
      await item.save();
    } else {
      item = await Cart.create({
        userId: user._id,
        productId,
        productName: product.prodName,
        price: product.prodPrice,
        image: product.productimage,
        quantity: quantity || 1,
      });
    }

    res.status(200).json({
    
      message: "Item added to cart",
      cartItem: item,
    });
  } catch (err: any) {
    res.status(500).json({
      category: "SERVER_ERROR",
      message: "Error adding to cart",
      error: err.message,
    });
  }
};

// ✅ Get cart for logged-in user
export const getCartByUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        
        message: "First login to view cart",
      });
    }

    const cartItems = await Cart.find({ userId: user._id });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({
        
        message: "empty cart",
      });
    }

    res.status(200).json({
      
      message: "Cart listed successfully",
      cart: cartItems,
    });
  } catch (err: any) {
    res.status(500).json({
      
      message: "Error fetching cart",
      error: err.message,
    });
  }
};

// ✅ Update quantity of a cart item
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
       
        message: "Quantity must be greater than 0",
      });
    }

    const item = await Cart.findById(id);
    if (!item) {
      return res.status(404).json({
       
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;
    await item.save();

    res.status(200).json({
      category: "SUCCESS",
      message: "Cart item updated successfully",
      updatedItem: item,
    });
  } catch (err: any) {
    res.status(500).json({
      
      message: "Error updating cart item",
      error: err.message,
    });
  }
};

//  Remove a single cart item
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await Cart.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({
        category: "NOT_FOUND",
        message: "Cart item not found",
      });
    }

    res.status(200).json({
     
      message: "Cart Product removed",
    });
  } catch (err: any) {
    res.status(500).json({
      category: "SERVER_ERROR",
      message: "Error removing product from cart",
      error: err.message,
    });
  }
};

//  Clear all items in logged-in user’s cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user._id) {
      return res.status(401).json({
        message: "Login required to clear cart",
      });
    }

    await Cart.deleteMany({ userId: user._id });

    res.status(200).json({
      
      message: "Cart cleared successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      
      message: "Error clearing cart",
      error: err.message,
    });
  }
};
