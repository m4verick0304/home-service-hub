import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export function PaymentForm({ amount, onSuccess }: { amount: number; onSuccess: (id: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      // Call backend to create payment intent
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment intent');

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card }
      });

      if (result.error) {
        toast({ title: 'Payment failed', description: result.error.message, variant: 'destructive' });
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err: any) {
      toast({ title: 'Payment error', description: err.message, variant: 'destructive' });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 rounded-lg border">
        <CardElement />
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </Button>
    </form>
  );
}
