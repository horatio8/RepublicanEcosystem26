import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yqzpbitsqfsarndgoriw.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_a2jvKKgdAQ-LU5v8U74JSQ_BmJ3I68y'

// Client-side Supabase client (uses anon key — read-only via RLS)
export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
