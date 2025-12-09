'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { CreditCard, Phone } from 'lucide-react';
import { useState } from 'react';

interface Address {
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Redirect to success page
      window.location.href = '/checkout/success';
    }, 2000);
  };

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
  };

  const defaultCenter = {
    lat: -1.2921,
    lng: 36.8219,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Shipping Step */}
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} className="p-8">
            <h2 className="text-2xl font-bold text-base-content mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address Line 1</span>
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Address Line 2</span>
                </label>
                <input
                  type="text"
                  placeholder="Apartment, suite, etc."
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Postal Code</span>
                </label>
                <input
                  type="text"
                  placeholder="Postal code"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Map Preview */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text">Location Preview</span>
              </label>
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={10}
                  options={{
                    styles: [
                      {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }],
                      },
                    ],
                  }}
                >
                  <Marker position={defaultCenter} />
                </GoogleMap>
              </LoadScript>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Continue to Payment
            </button>
          </form>
        )}

        {/* Payment Step */}
        {step === 2 && (
          <form onSubmit={handlePaymentSubmit} className="p-8">
            <h2 className="text-2xl font-bold text-base-content mb-6">Payment Method</h2>
            <div className="space-y-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa')}
                className={`btn w-full ${paymentMethod === 'mpesa' ? 'btn-primary' : 'btn-outline'}`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                M-Pesa
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`btn w-full ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline'}`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Credit/Debit Card
              </button>
            </div>

            {paymentMethod === 'mpesa' && (
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="tel"
                    placeholder="254 700 123 456"
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Card Number</span>
                  </label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="input input-bordered w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Expiry Date</span>
                    </label>
                    <input type="text" placeholder="MM/YY" className="input input-bordered w-full" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">CVV</span>
                    </label>
                    <input type="text" placeholder="123" className="input input-bordered w-full" />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing Payment...
                </>
              ) : (
                'Complete Order'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}