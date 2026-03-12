import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise = null;

/**
 * Lazy-load Stripe.js singleton.
 * Returns null if no public key is configured.
 */
export function getStripe() {
  if (!stripePublicKey || stripePublicKey === 'pk_test_PLACEHOLDER') {
    console.warn('[Stripe] Clé publique non configurée. Paiement par carte indisponible.');
    return null;
  }
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
}

/**
 * Check if Stripe is configured (non-placeholder key present).
 */
export function isStripeConfigured() {
  return !!stripePublicKey && stripePublicKey !== 'pk_test_PLACEHOLDER';
}
