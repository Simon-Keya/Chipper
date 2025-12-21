'use client';

import { createOrder } from '@/lib/api';
import { MapPin, Phone, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Address {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface CartItemLocal {
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemLocal[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const router = useRouter();

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('chipper_cart');
      if (!stored) return;

      try {
        const items: CartItemLocal[] = JSON.parse(stored);
        setCartItems(items);

        const total = items.reduce((sum, item) => 
          sum + item.product.price * item.quantity, 0
        );
        setOrderTotal(total);
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };

    loadCart();
  }, []);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.line1 || !address.city || !address.postalCode || !address.phone) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to place order');

      // Build customer details string
      const customerDetails = [
        address.phone,
        address.line1,
        address.line2?.trim(),
        address.city,
        address.postalCode,
      ].filter(Boolean).join(' | ');

      // Create one order per cart item
      const orderPromises = cartItems.map(item =>
        createOrder({
          productId: item.productId,
          quantity: item.quantity,
          customerDetails,
          status: 'Pending',
        }, token)
      );

      await Promise.all(orderPromises);

      // Success!
      localStorage.removeItem('chipper_cart');
      window.dispatchEvent(new Event('cart-updated'));

      router.push('/checkout/success');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Order failed:', err);
      alert(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-base-content/40'}`}>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <span className="ml-3 font-medium">Shipping</span>
          </div>
          <div className="w-32 h-1 bg-base-300 mx-6" />
          <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-base-content/40'}`}>
            <div className={`w-10 h-10 rounded-full ${step === 2 ? 'bg-primary text-white' : 'bg-base-300'} flex items-center justify-center font-bold`}>2</div>
            <span className="ml-3 font-medium">Confirm</span>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Shipping */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <MapPin className="w-9 h-9 text-primary" />
                <h2 className="text-3xl font-bold">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="label"><span className="label-text font-medium">Street Address *</span></label>
                  <input type="text" placeholder="House number and street" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} className="input input-bordered w-full" required />
                </div>

                <div className="md:col-span-2">
                  <label className="label"><span className="label-text font-medium">Apartment, Suite (optional)</span></label>
                  <input type="text" placeholder="Apartment, floor, building" value={address.line2} onChange={e => setAddress({...address, line2: e.target.value})} className="input input-bordered w-full" />
                </div>

                <div>
                  <label className="label"><span className="label-text font-medium">City *</span></label>
                  <input type="text" placeholder="Nairobi" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="input input-bordered w-full" required />
                </div>

                <div>
                  <label className="label"><span className="label-text font-medium">Postal Code *</span></label>
                  <input type="text" placeholder="00100" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="input input-bordered w-full" required />
                </div>

                <div className="md:col-span-2">
                  <label className="label"><span className="label-text font-medium">Phone Number *</span></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                    <input type="tel" placeholder="254700123456" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="input input-bordered w-full pl-12" required />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button type="submit" className="btn btn-primary btn-lg">Continue →</button>
              </div>
            </form>
          )}

          {/* Confirmation */}
          {step === 2 && (
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <Truck className="w-9 h-9 text-primary" />
                <h2 className="text-3xl font-bold">Review & Confirm</h2>
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 mb-8 border-2 border-primary">
                <div className="flex items-center gap-4">
                  <Truck className="w-12 h-12 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold">Cash on Delivery</h3>
                    <p className="text-base-content/80">Pay with cash when your order arrives — most trusted option</p>
                  </div>
                </div>
              </div>

              <div className="bg-base-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-xl mb-4">Order Summary ({cartItems.length} items)</h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">KSh {orderTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleOrderSubmit}>
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <>Processing Order...</>
                  ) : (
                    'Place Order — Pay on Delivery'
                  )}
                </button>
              </form>

              <button onClick={() => setStep(1)} className="btn btn-ghost w-full mt-4">
                ← Back to Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}