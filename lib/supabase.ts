import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Stub / optional client.
// Returns null when env vars are not set — the site then falls back to
// data/deals.json (see lib/deals.ts). See SUPABASE_SETUP.md to enable it.
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && anonKey ? createClient(url, anonKey) : null;
  return cached;
}
