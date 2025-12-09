import { CartItem } from './types';

const CART_KEY = 'chipper_cart';

export const getCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (productId: number, quantity: number = 1): void => {
  const cart = getCartFromStorage();
  const existingItemIndex = cart.findIndex(item => item.product.id === productId);
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Fetch product details (in real app, fetch from API)
    const product = { id: productId, name: 'Product', price: 0, imageUrl: '' }; // Placeholder
    cart.push({ id: Date.now(), product, quantity });
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const updateCartQuantity = (cartItemId: number, quantity: number): void => {
  const cart = getCartFromStorage();
  const itemIndex = cart.findIndex(item => item.id === cartItemId);
  if (itemIndex >= 0 && quantity > 0) {
    cart[itemIndex].quantity = quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } else if (quantity <= 0) {
    removeFromCart(cartItemId);
  }
};

export const removeFromCart = (cartItemId: number): void => {
  const cart = getCartFromStorage();
  const filteredCart = cart.filter(item => item.id !== cartItemId);
  localStorage.setItem(CART_KEY, JSON.stringify(filteredCart));
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};