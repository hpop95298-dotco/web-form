import { createClient } from '@supabase/supabase-js';

// Support Vite (VITE_), Next (NEXT_PUBLIC_), and direct Vercel Supabase integration variables
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  'https://vbwnrdxrkypvutcustif.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_SDorZD2QrLFEQzH93tNn6A_cBw_48XK';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'placeholder-anon-key'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
