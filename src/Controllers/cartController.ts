// import { Types } from 'mongoose';
// import { ICart } from '../models/cart';

// // ...

// // Update cart item
// export const updateCartItem = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params; // cartId
//     const { itemId, quantity } = req.body;

//     const cart = await Cart.findById(id);
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     // 👇 Cast so TS knows about .id()
//     const itemsArray = cart.items as unknown as Types.DocumentArray<any>;
//     const item = itemsArray.id(itemId);

//     if (!item) return res.status(404).json({ message: 'Item not found in cart' });

//     item.quantity = quantity;
//     await cart.save();

//     res.json(cart);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete cart item
// export const deleteCartItem = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params; // cartId
//     const { itemId } = req.body;

//     const cart = await Cart.findById(id);
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     const itemsArray = cart.items as unknown as Types.DocumentArray<any>;
//     const item = itemsArray.id(itemId);

//     if (!item) return res.status(404).json({ message: 'Item not found in cart' });

//     item.remove();
//     await cart.save();

//     res.json(cart);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };
