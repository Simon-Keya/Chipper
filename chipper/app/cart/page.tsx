'use client';

import { fetchCart, removeFromCart, updateCartItem } from '@/lib/api';
import { Product } from '@/lib/types';
import { CreditCard, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';

interface CartItem {
  id?: number;
  productId: number;
  product: Product;
  quantity: number;
}

const CART_KEY = 'chipper_cart';

const saveCartToStorage = (cartItems: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }
};

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem(CART_KEY);
  if (!cart) return [];
  try {
    return JSON.parse(cart);
  } catch {
    return [];
  }
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    setCartItems(loadCartFromStorage());
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    const syncWithBackend = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetchCart(token);
        const serverItems = Array.isArray(response?.items) ? response.items : [];

        const transformed: CartItem[] = serverItems.map((item: any) => ({
          id: item.id,
          productId: item.product?.id || 0,
          product: item.product,
          quantity: item.quantity || 1,
        }));

        const localCart = loadCartFromStorage();
        const merged = [...transformed];

        localCart.forEach(localItem => {
          const existing = merged.find(m => m.productId === localItem.productId);
          if (existing) {
            existing.quantity = Math.max(existing.quantity, localItem.quantity);
          } else {
            merged.push(localItem);
          }
        });

        setCartItems(merged);
        saveCartToStorage(merged);
      } catch (err) {
        console.warn('Backend cart sync failed — using local cart:', err);
        // Critical: Do NOT crash — use local cart
        setCartItems(loadCartFromStorage());
      }
    };

    syncWithBackend();
  }, [mounted, user]);

  useEffect(() => {
    if (mounted) {
      saveCartToStorage(cartItems);
      // Dispatch update for header
      window.dispatchEvent(new Event('cart-updated'));
    }
  }, [cartItems, mounted]);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem('token');
    if (token && user) {
      const serverItem = cartItems.find(item => item.id && item.productId === productId);
      if (serverItem?.id) {
        try {
          await updateCartItem(serverItem.id, newQuantity, token);
        } catch (err) {
          console.error('Failed to update server cart:', err);
        }
      }
    }

    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = async (productId: number) => {
    const token = localStorage.getItem('token');
    if (token && user) {
      const serverItem = cartItems.find(item => item.id && item.productId === productId);
      if (serverItem?.id) {
        try {
          await removeFromCart(serverItem.id, token);
        } catch (err) {
          console.error('Failed to remove from server:', err);
        }
      }
    }

    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    setLoading(true);
    router.push('/checkout');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-24 h-24 text-base-content/40 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-base-content mb-4">Your Cart is Empty</h2>
          <p className="text-base-content/60 mb-8">Start adding items to see them here.</p>
          <Link href="/products">
            <button className="btn btn-primary">Browse Products</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-primary text-primary-content p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <p className="opacity-80">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
              </div>
              <Link href="/products">
                <button className="btn btn-ghost btn-sm">Continue Shopping</button>
              </Link>
            </div>
          </div>

          <div className="divide-y divide-base-300">
            {cartItems.map((item) => (
              <div key={item.productId} className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.imageUrl || '/placeholder.jpg'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base-content mb-1 truncate">{item.product.name}</h3>
                    <p className="text-sm text-base-content/60 mb-2">KSh {item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)} 
                        disabled={item.quantity <= 1}
                        className="btn btn-sm btn-outline btn-square"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 bg-base-200 rounded font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                        className="btn btn-sm btn-outline btn-square"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-lg text-base-content">
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => removeItem(item.productId)} 
                      className="btn btn-sm btn-error btn-square"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-base-200">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-base-content/70">
                <span>Subtotal</span>
                <span>KSh {getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-base-content/70">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-base-300">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">KSh {getTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-base-300">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}