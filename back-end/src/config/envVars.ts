import dotenv from 'dotenv';

dotenv.config();

export const ENV_VARS = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,

  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,

  // Stripe
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  STRIPE_PUBLIC: process.env.STRIPE_PUBLIC,
  STRIPE_ID_PLAN: process.env.STRIPE_ID_PLAN,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
