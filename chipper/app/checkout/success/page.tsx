'use client';

import { CheckCircle, Clock, Package, Shield, Truck } from 'lucide-react';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { useEffect } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || `ORD-${Date.now().toString().slice(-8)}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chipper_cart');
      window.dispatchEvent(new Event('cart-updated'));
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-10 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl opacity-90">
              Thank you for shopping with Chipper! 🎉
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="text-center mb-10">
              <p className="text-lg text-base-content/80 mb-2">
                Your order has been successfully placed.
              </p>
              <p className="text-2xl font-bold text-primary">
                {orderId}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base-content mb-1">Fast Delivery</h3>
                <p className="text-sm text-base-content/70">2-5 business days nationwide</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-base-content mb-1">Easy Tracking</h3>
                <p className="text-sm text-base-content/70">You&apos;ll get updates via SMS</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-bold text-base-content mb-1">Secure & Trusted</h3>
                <p className="text-sm text-base-content/70">Pay on delivery available</p>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                What happens next?
              </h3>
              <ol className="space-y-3 text-base-content/80">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1.</span>
                  We&apos;ll confirm your order via SMS within 1 hour
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2.</span>
                  Your items will be packed and dispatched
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3.</span>
                  Pay when you receive your package (Cash on Delivery)
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/profile/orders" className="flex-1">
                <button className="btn btn-primary btn-lg w-full">
                  View My Orders
                </button>
              </Link>
              <Link href="/products" className="flex-1">
                <button className="btn btn-outline btn-lg w-full">
                  Continue Shopping
                </button>
              </Link>
            </div>

            <p className="text-center text-sm text-base-content/60 mt-8">
              Need help? Contact us on WhatsApp:{' '}
              <a href="https://wa.me/254768378046" className="link text-primary font-medium">
                +254 768 378 046
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}