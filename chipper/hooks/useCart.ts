import { addToCart, getCartTotal, removeFromCart, updateCartQuantity } from '@/lib/cart';
import { CartItem, Product } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  addItem: (product: Partial<Product>, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Partial<Product>, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item: CartItem) => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((item: CartItem) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, {
              id: Date.now(),
              productId: product.id || 0,
              product: product as Product,
              quantity,
            }],
          });
        }
        
        // Persist to backend if authenticated
        if (product.id) {
          addToCart(product.id, quantity);
        }
      },
      updateQuantity: (itemId: number, quantity: number) => {
        set({
          items: get().items.map((item: CartItem) =>
            item.id === itemId ? { ...item, quantity } : item
          ).filter((item: CartItem) => item.quantity > 0),
        });
        
        // Sync with backend
        updateCartQuantity(itemId, quantity);
      },
      removeItem: (itemId: number) => {
        set({
          items: get().items.filter((item: CartItem) => item.id !== itemId),
        });
        
        // Sync with backend
        removeFromCart(itemId);
      },
      clearCart: () => {
        set({ items: [] });
        // Clear from backend
      },
      getTotal: () => getCartTotal(get().items),
      itemCount: () => get().items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);