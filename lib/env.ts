import { z } from 'zod';

/**
 * Environment variable validation schema.
 * Validates all required environment variables at startup to ensure
 * edge/server bundles are consistent and fail fast with clear errors.
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required').optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required').optional(),
  
  // Application
  BASE_URL: z.string().url('BASE_URL must be a valid URL').optional(),
}).passthrough(); // Allow additional env vars that aren't validated

/**
 * Validated environment variables.
 * Throws an error at startup if any required variables are missing.
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  BASE_URL: process.env.BASE_URL,
});

// Export individual variables for convenience
export const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
export const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
export const BASE_URL = env.BASE_URL;

