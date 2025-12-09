import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const initializeStripe = () => stripePromise;

export const createPaymentIntent = async (amount: number) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) throw new Error('Failed to create payment intent');

  return response.json();
};

export const confirmPayment = async (clientSecret: string, paymentMethodId: string) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe not loaded');

  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethodId,
  });

  if (error) throw error;
  return paymentIntent;
};