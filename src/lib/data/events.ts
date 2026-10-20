// src/lib/data/events.ts — the only place that knows event table/column names.
// Reads with the anon key; RLS only lets published events through. Never select `review_note`.
// Row shape per plans/SETUP-supabase-vercel.md §3a:
//   id uuid, status event_status, title text, description text, link_url text,
//   type event_type, starts_at timestamptz | null, cover_image_path text | null,
//   series_id uuid | null references event_series(id)
import type { EventType, PublicEvent } from "@/lib/types";
import { publicDb, rows } from "@/lib/supabase/server";
import { fixtureEvents } from "./fixtures";

export const EVENT_COLUMNS = "id,status,title,description,link_url,type,starts_at,cover_image_path,series_id";

export type EventRow = {
  id: string;
  status: "pending" | "published" | "rejected" | "archived";
  title: string;
  description: string;
  link_url: string;
  type: EventType;
  starts_at: string | null;
  cover_image_path: string | null;
  series_id: string | null;
};

export function mapEvent(row: EventRow): PublicEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    startsAt: row.starts_at,
    linkUrl: row.link_url,
    seriesId: row.series_id ?? undefined,
  };
}

export async function getUpcomingEvents(
  opts: { limit?: number; type?: EventType } = {},
): Promise<PublicEvent[]> {
  // Events from yesterday on stay listed for a day, and undated ones ("TBC") come first.
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const db = publicDb();
  if (db) {
    let q = db
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("status", "published")
      .or(`starts_at.is.null,starts_at.gte.${since}`)
      .order("starts_at", { nullsFirst: true });
    if (opts.type) q = q.eq("type", opts.type);
    if (opts.limit) q = q.limit(opts.limit);
    return rows(await q, "events").map((r) => mapEvent(r as EventRow));
  }

  const now = Date.now();
  let list = fixtureEvents.filter((e) => !e.startsAt || Date.parse(e.startsAt) >= now - 86_400_000);
  if (opts.type) list = list.filter((e) => e.type === opts.type);
  list.sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""));
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getEventsByMonth(
  type?: EventType,
): Promise<Array<{ month: string; events: PublicEvent[] }>> {
  const events = await getUpcomingEvents({ type });
  const groups = new Map<string, PublicEvent[]>();
  for (const e of events) {
    const month = e.startsAt
      ? new Date(e.startsAt).toLocaleDateString("en-US", { month: "long", timeZone: "America/Los_Angeles" })
      : "Date to be confirmed";
    groups.set(month, [...(groups.get(month) ?? []), e]);
  }
  return [...groups].map(([month, events]) => ({ month, events }));
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "America/Los_Angeles",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Los_Angeles",
});

export function formatEventDate(iso: string | null) {
  return iso ? dateFmt.format(new Date(iso)) : "TBC";
}
export function formatEventTime(iso: string | null) {
  return iso ? timeFmt.format(new Date(iso)).toLowerCase().replace(" ", "") : "";
}
