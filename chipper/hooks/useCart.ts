import { addToCart, getCartTotal, removeFromCart, updateCartQuantity } from '@/lib/cart';
import { CartItem } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  addItem: (product: { id: number; name: string; price: number; imageUrl: string }, quantity?: number) => void;
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
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, {
              id: Date.now(),
              product,
              quantity,
            }],
          });
        }
        
        // Persist to backend if authenticated
        addToCart(product.id, quantity);
      },
      updateQuantity: (itemId, quantity) => {
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ).filter(item => item.quantity > 0),
        });
        
        // Sync with backend
        updateCartQuantity(itemId, quantity);
      },
      removeItem: (itemId) => {
        set({
          items: get().items.filter(item => item.id !== itemId),
        });
        
        // Sync with backend
        removeFromCart(itemId);
      },
      clearCart: () => {
        set({ items: [] });
        // Clear from backend
      },
      getTotal: () => getCartTotal(get().items),
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);