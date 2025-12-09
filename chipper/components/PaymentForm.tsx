'use client';

import { Card, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

const PaymentFormInner = ({ amount, onSuccess }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(Card)!,
          billing_details: {
            name: 'Customer Name', // From form
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Card Details</span>
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
            Processing...
          </>
        ) : (
          `Pay KSh ${amount.toLocaleString()}`
        )}
      </button>
    </form>
  );
};

export default function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner amount={amount} onSuccess={onSuccess} />
    </Elements>
  );
}