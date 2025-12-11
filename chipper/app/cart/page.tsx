'use client';

import { fetchCart, removeFromCart, updateCartItem } from '@/lib/api';
import { Product } from '@/lib/types';
import { CreditCard, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}

const CART_KEY = 'chipper_cart';

const saveCartToStorage = (cartItems: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

const loadCartFromStorage = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage());
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    syncCart();
  }, []);

  const syncCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSyncLoading(true);
    try {
      const apiCart = await fetchCart(token);
      // Merge with localStorage (prioritize API)
      const localCart = loadCartFromStorage();
      const mergedCart = [...apiCart.items];
      
      localCart.forEach(localItem => {
        const apiIndex = mergedCart.findIndex(item => item.product.id === localItem.product.id);
        if (apiIndex >= 0) {
          // Update quantity if local has newer changes
          mergedCart[apiIndex].quantity = Math.max(mergedCart[apiIndex].quantity, localItem.quantity);
        } else {
          mergedCart.push(localItem);
        }
      });

      setCartItems(mergedCart);
      saveCartToStorage(mergedCart);
    } catch (err) {
      console.error('Failed to sync cart:', err);
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await updateCartItem(itemId, newQuantity, token);
      } catch (err) {
        console.error('Failed to update cart item:', err);
      }
    }

    const newCartItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(newCartItems);
  };

  const removeItem = async (itemId: number) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await removeFromCart(itemId, token);
      } catch (err) {
        console.error('Failed to remove cart item:', err);
      }
    }

    const newCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newCartItems);
    saveCartToStorage(newCartItems);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Sync cart before checkout
        await syncCart();
        // Proceed to checkout API
        // const response = await fetch('/api/checkout', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        //   body: JSON.stringify({ items: cartItems }),
        // });
        // if (response.ok) {
        //   clearCart(); // Clear after successful checkout
        //   router.push('/checkout');
        // }
      }
      router.push('/checkout');
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-24 h-24 text-base-content/40 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-base-content mb-4">Your Cart is Empty</h2>
          <p className="text-base-content/60 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/products">
            <button className="btn btn-primary">Start Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  if (syncLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-2 text-base-content">Syncing cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-content p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <p className="opacity-80">{cartItems.length} items</p>
              </div>
              <Link href="/products">
                <button className="btn btn-ghost btn-sm">Continue Shopping</button>
              </Link>
            </div>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-base-300">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base-content mb-1 truncate">{item.product.name}</h3>
                    <p className="text-sm text-base-content/60 mb-2">KSh {item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-sm btn-outline btn-square">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 bg-base-200 rounded">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-sm btn-outline btn-square">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-lg text-base-content">
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => removeItem(item.id)} className="btn btn-sm btn-error btn-square">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
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

          {/* Actions */}
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