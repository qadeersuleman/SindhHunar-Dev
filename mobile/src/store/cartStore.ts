import { useAppSelector, useAppDispatch } from './hooks';
import { addToCart, removeFromCart, updateQuantity, clearCart } from './slices/cartSlice';
import { Product } from '../types/product.types';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: (product: Product, quantity: number = 1) => 
      dispatch(addToCart({ product, quantity })),
    removeFromCart: (productId: string) => 
      dispatch(removeFromCart(productId)),
    updateQuantity: (productId: string, quantity: number) => 
      dispatch(updateQuantity({ productId, quantity })),
    clearCart: () => 
      dispatch(clearCart()),
  };
};

