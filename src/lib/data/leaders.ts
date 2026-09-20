// src/lib/data/leaders.ts — the only place that knows the `leaders` table.
// TODO(supabase): replace fixtures with .from('leaders').select(...).eq('is_active', true).order('sort_order')
// Row shape per plans/SETUP-supabase-vercel.md §3a.
import type { Leader } from "@/lib/types";
import { fixtureLeaders } from "./fixtures";

export type LeaderRow = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  contact: string | null;
  contact_href: string | null;
  photo_path: string | null;
  sort_order: number;
  is_active: boolean;
  is_primary_contact: boolean;
};

export function mapLeader(row: LeaderRow): Leader {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio ?? undefined,
    contact: row.contact ?? undefined,
    contactHref: row.contact_href ?? undefined,
    avatar: row.photo_path ? { src: row.photo_path, alt: row.name } : undefined,
  };
}

export async function getLeaders(limit?: number): Promise<Leader[]> {
  return limit ? fixtureLeaders.slice(0, limit) : fixtureLeaders;
}
