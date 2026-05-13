import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// For backend server operations, we use the service role key to bypass RLS.
// NEVER expose this key to the frontend.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
