import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yqzpbitsqfsarndgoriw.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_a2jvKKgdAQ-LU5v8U74JSQ_BmJ3I68y'

// Client-side Supabase client (uses anon key — read-only via RLS)
export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Server-side Supabase client (uses service role key — full read/write)
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(SUPABASE_URL, serviceKey)
}
