'use client';

import { useAuth } from '@/hooks/useAuth';
import { CreditCard, MapPin, Phone, Truck } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cod'>('cod'); // Default to COD
  const [loading, setLoading] = useState(false);
  const [orderTotal] = useState(12500); // In real app: calculate from cart
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Optional: Load saved address from user profile
    if (user) {
      // You can pre-fill from user data here
    }
  }, [user]);

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
    setLoading(true);

    try {
      // Simulate order creation
      // In production: Call your /api/orders endpoint with address + paymentMethod + cart items
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart after successful order
      localStorage.removeItem('chipper_cart');
      window.dispatchEvent(new Event('cart-updated'));

      router.push('/checkout/success');
    } catch (err) {
      console.error('Order failed:', err);
      alert('Order failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-base-content/40'}`}>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <span className="ml-3 font-medium">Shipping</span>
          </div>
          <div className="w-32 h-1 bg-base-300 mx-4" />
          <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-base-content/40'}`}>
            <div className={`w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-base-300'} flex items-center justify-center font-bold`}>2</div>
            <span className="ml-3 font-medium">Payment</span>
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-base-content">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Street Address *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="House number and street name"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Apartment, Suite, etc. (optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Apartment, floor, building name"
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">City *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nairobi, Mombasa, etc."
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Postal Code *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="00100"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number *</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                    <input
                      type="tel"
                      placeholder="254700123456"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="input input-bordered w-full pl-12"
                      required
                    />
                  </div>
                  <label className="label">
                    <span className="label-text-alt">We&apos;ll use this to confirm delivery</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button type="submit" className="btn btn-primary btn-lg">
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <form onSubmit={handleOrderSubmit} className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <CreditCard className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-base-content">Payment Method</h2>
              </div>

              <div className="space-y-4 mb-8">
                {/* Pay on Delivery (Recommended) */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="radio radio-primary hidden"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className={`p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Truck className="w-10 h-10 text-primary" />
                        <div>
                          <h3 className="font-bold text-lg">Cash on Delivery (Recommended)</h3>
                          <p className="text-base-content/70">Pay with cash when your order arrives</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        {paymentMethod === 'cod' && <div className="w-3 h-3 bg-primary rounded-full" />}
                      </div>
                    </div>
                  </div>
                </label>

                {/* M-Pesa */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="radio radio-primary hidden"
                    checked={paymentMethod === 'mpesa'}
                    onChange={() => setPaymentMethod('mpesa')}
                  />
                  <div className={`p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">M-Pesa</h3>
                          <p className="text-base-content/70">Pay instantly via mobile money</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        {paymentMethod === 'mpesa' && <div className="w-3 h-3 bg-primary rounded-full" />}
                      </div>
                    </div>
                  </div>
                </label>

                {/* Card (Placeholder) */}
                <label className="cursor-pointer opacity-60">
                  <input
                    type="radio"
                    name="payment"
                    className="radio radio-primary hidden"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    disabled
                  />
                  <div className="p-6 rounded-2xl border-2 border-base-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CreditCard className="w-10 h-10 text-base-content/50" />
                        <div>
                          <h3 className="font-bold text-lg">Credit/Debit Card</h3>
                          <p className="text-base-content/70">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Order Summary */}
              <div className="bg-base-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-xl mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Ksh {orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">KSh {orderTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing Order...
                    </>
                  ) : paymentMethod === 'cod' ? (
                    'Place Order (Pay on Delivery)'
                  ) : (
                    'Complete Payment'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-ghost"
                >
                  Back to Shipping
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}