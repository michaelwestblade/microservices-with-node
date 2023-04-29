import Stripe from "stripe";

const STRIPE_KEY = process.env.STRIPE_KEY || "";

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: "2022-11-15",
});
