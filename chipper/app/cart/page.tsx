'use client';

import { useAuth } from '@/hooks/useAuth';
import { removeFromCart, updateCartItem } from '@/lib/api';
import { Product } from '@/lib/types';
import { ArrowLeft, CreditCard, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    const stored = loadCartFromStorage();
    setCartItems(stored);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, mounted]);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token && user) {
      const serverItem = cartItems.find(item => item.id && item.productId === productId);
      if (serverItem?.id) {
        try {
          await updateCartItem(serverItem.id, newQuantity, token);
        } catch (err) {
          console.error('Failed to sync quantity:', err);
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
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

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setLoading(true);
    router.push('/checkout');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1B4332] border-t-[#FB8500] rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium">Loading your basket...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven&apos;t added any electronics or networking gear yet.</p>
          <Link href="/products" className="inline-block w-full">
            <button className="w-full py-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/products" className="flex items-center text-slate-600 hover:text-[#FB8500] transition-colors font-medium group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Products
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Shopping Cart ({cartItems.length})</h1>
            <div className="w-24"></div> {/* Spacer */}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
                {/* Product Image */}
                <div className="w-full md:w-32 h-32 relative bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.imageUrl || '/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-slate-800 leading-tight">{item.product.name}</h3>
                        <button 
                            onClick={() => removeItem(item.productId)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[#1B4332] font-semibold">KSh {item.product.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 md:mt-0">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-slate-50 disabled:opacity-30 transition-colors text-slate-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-slate-50 transition-colors text-[#FB8500]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xl font-bold text-slate-800">
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 sticky top-28">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <div className="flex items-center">
                    <span>Shipping</span>
                    {shipping === 0 && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Free</span>}
                  </div>
                  <span className="font-medium text-slate-800">
                    {shipping === 0 ? 'KSh 0' : `KSh ${shipping.toLocaleString()}`}
                  </span>
                </div>
                {shipping > 0 && (
                    <p className="text-[11px] text-[#FB8500] font-medium bg-orange-50 p-2 rounded-lg">
                        Add KSh {(5000 - subtotal).toLocaleString()} more for Free Shipping!
                    </p>
                )}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                  <span className="text-slate-800 font-bold text-lg">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-[#1B4332]">KSh {total.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Inclusive of VAT</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-5 bg-[#FB8500] hover:bg-[#FF9F1C] text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                        <CreditCard className="w-6 h-6" />
                        CHECKOUT NOW
                    </>
                )}
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
                    </div>
                    <p>Secure SSL encrypted payments</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4 text-[#FB8500]" />
                    </div>
                    <p>Next day delivery in Nairobi & Environs</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}