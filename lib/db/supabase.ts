import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from '@/lib/env';

/**
 * Create a Supabase client for server-side operations with SSR support.
 * This client respects Row Level Security (RLS) policies based on the authenticated user.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with service role key for admin operations.
 * This bypasses RLS and should only be used in server-side API routes
 * or webhooks where elevated permissions are required.
 */
export function createServiceRoleClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  }

  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

