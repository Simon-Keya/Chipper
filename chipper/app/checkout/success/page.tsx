'use client';

import { CheckCircle, Clock, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-123456';

  useEffect(() => {
    // Clear cart only on client side
    if (typeof window !== 'undefined') {
      // Use your cart key if you have one
      localStorage.removeItem('chipper_cart');
      // Or if you use a different key:
      // localStorage.removeItem('cart');
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
      <div className="max-w-2xl w-full mx-auto">
        {/* Success Banner */}
        <div className="bg-success text-success-content rounded-2xl p-8 text-center mb-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg opacity-90">Thank you for your purchase. Your order has been placed successfully.</p>
        </div>

        {/* Order Summary */}
        <div className="bg-base-100 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-base-content mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-base-content/70">Order Number:</span>
              <span className="font-semibold">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/70">Estimated Delivery:</span>
              <span className="font-semibold">2-3 business days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/70">Status:</span>
              <span className="badge badge-success">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-base-100 rounded-xl p-4 text-center">
            <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-base-content mb-1">Fast Delivery</h3>
            <p className="text-sm text-base-content/60">Arrives in 2-3 days</p>
          </div>
          <div className="bg-base-100 rounded-xl p-4 text-center">
            <Shield className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-base-content mb-1">Secure Payment</h3>
            <p className="text-sm text-base-content/60">Your data is protected</p>
          </div>
          <div className="bg-base-100 rounded-xl p-4 text-center">
            <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
            <h3 className="font-semibold text-base-content mb-1">Track Order</h3>
            <p className="text-sm text-base-content/60">Real-time updates</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile/orders">
            <button className="btn btn-primary flex-1">
              View Order
            </button>
          </Link>
          <Link href="/products">
            <button className="btn btn-outline flex-1">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}