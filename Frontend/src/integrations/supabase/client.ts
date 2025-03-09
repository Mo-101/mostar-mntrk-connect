
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/utils/envConfig';

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

/**
 * Get the Supabase client with service role if available
 * This should only be used for authenticated server-side operations that need 
 * admin privileges (e.g., bypassing RLS policies)
 */
export function getAdminSupabaseClient() {
  if (!supabaseConfig.serviceRoleKey) {
    console.warn('Service role key not available. Using anonymous client instead.');
    return supabase;
  }
  
  return createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey
  );
}
