// src/lib/supabase/server.ts — the two Supabase clients, server only (plans/SETUP-supabase-vercel.md §4).
// publicDb() uses the anon key, so row level security decides what it sees: published events, active
// leaders, settings, unfinished series. privateDb() uses the service-role key and bypasses RLS; only the
// gated /sangha pages may use it, for library_items and member_posts, which have no public read policy.
//
// Without the env vars, development falls back to the fixtures (null here) so the site runs with no
// project; a production build fails instead of quietly shipping sample data.
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

function client(key: string | undefined, name: string): SupabaseClient | null {
  if (url && key) return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  if (process.env.NODE_ENV === "production") {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL and ${name} must be set (plans/SETUP-supabase-vercel.md §4)`);
  }
  return null;
}

let anon: SupabaseClient | null | undefined;
let service: SupabaseClient | null | undefined;

export function publicDb() {
  if (anon === undefined) anon = client(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return anon;
}

export function privateDb() {
  if (service === undefined) service = client(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
  return service;
}

/** Unwraps a query result; a failed query throws so a cached page keeps its last good render. */
export function rows<T>({ data, error }: { data: T | null; error: { message: string } | null }, what: string): T {
  if (error) throw new Error(`Supabase ${what}: ${error.message}`);
  return data as T;
}
