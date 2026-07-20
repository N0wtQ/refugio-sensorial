import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// `supabase` is null until real credentials are configured (see
// docs/comunidad-supabase-setup.md). Every consumer must guard for this —
// a missing config must never crash the rest of the site.
export const supabase = (url && anonKey) ? createClient(url, anonKey) : null

if (!supabase && import.meta.env.DEV) {
  console.warn(
    '[Comunidad] Supabase no configurado — define VITE_SUPABASE_URL y ' +
    'VITE_SUPABASE_ANON_KEY en .env.local (ver docs/comunidad-supabase-setup.md).'
  )
}
