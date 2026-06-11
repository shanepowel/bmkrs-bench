import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function platformFeePercent(): number {
  const n = Number(process.env.PLATFORM_FEE_PERCENT ?? "10");
  return Number.isFinite(n) && n >= 0 && n <= 50 ? n : 10;
}

export function appUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export function toCents(amount: number | string) {
  return Math.round(Number(amount) * 100);
}
