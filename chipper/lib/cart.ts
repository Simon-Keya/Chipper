// lib/cart.ts

const CART_KEY = 'chipper_cart';

// Minimal product shape for localStorage
interface StoredProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

// Cart item shape stored in localStorage
interface StoredCartItem {
  id: number;
  productId: number;
  quantity: number;
  product: StoredProduct;
}

export const getCartFromStorage = (): StoredCartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (productId: number, quantity: number = 1): void => {
  const cart = getCartFromStorage();
  const existingItemIndex = cart.findIndex(item => item.productId === productId);
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    const placeholderProduct: StoredProduct = {
      id: productId,
      name: 'Loading...',
      price: 0,
      imageUrl: '',
    };
    cart.push({
      id: Date.now() + Math.random(),
      productId,
      product: placeholderProduct,
      quantity,
    });
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const updateCartQuantity = (cartItemId: number, quantity: number): void => {
  const cart = getCartFromStorage();
  const itemIndex = cart.findIndex(item => item.id === cartItemId);
  if (itemIndex >= 0) {
    if (quantity > 0) {
      cart[itemIndex].quantity = quantity;
    } else {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
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

export const getCartTotal = (cart: StoredCartItem[]): number => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Full Product type copied from your types.ts (to avoid import issues)
interface FullProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  imageUrl: string;
  stock: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
    imageUrl: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Full CartItem type
interface FullCartItem {
  id: number;
  productId: number;
  quantity: number;
  product: FullProduct;
}

// Helper to convert stored cart to full cart items with real product data
export const hydrateCart = (
  storedCart: StoredCartItem[],
  realProducts: FullProduct[]
): FullCartItem[] => {
  const productMap = new Map(realProducts.map(p => [p.id, p]));
  
  return storedCart.map(item => {
    const realProduct = productMap.get(item.productId);
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: realProduct || {
        id: item.productId,
        name: item.product.name || 'Product not found',
        price: item.product.price || 0,
        imageUrl: item.product.imageUrl || '',
        image: '',
        description: '',
        stock: 0,
        categoryId: 0,
        category: { id: 0, name: 'Unknown', imageUrl: '', createdAt: '' },
        createdAt: '',
        updatedAt: '',
      },
    };
  });
};