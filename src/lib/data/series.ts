// src/lib/data/series.ts — the only place that knows the `event_series` table.
// TODO(supabase): .from('event_series').select('*, events(*)').neq('status','finished').order('starts_at')
// Row shape per plans/SETUP-supabase-vercel.md §3a.
import type { PublicSeries, SeriesStatus } from "@/lib/types";
import { fixtureSeries } from "./fixtures";

export type SeriesRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cadence: string;
  place: string;
  starts_at: string | null;
  ends_at: string | null;
  status: SeriesStatus;
  link_url: string | null;
};

export function mapSeries(row: SeriesRow): Omit<PublicSeries, "events"> {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    cadence: row.cadence,
    place: row.place,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    linkUrl: row.link_url ?? undefined,
  };
}

/** Running and upcoming series, each with its events in date order. */
export async function getSeries(opts: { limit?: number; includeFinished?: boolean } = {}): Promise<PublicSeries[]> {
  let list = fixtureSeries;
  if (!opts.includeFinished) list = list.filter((s) => s.status !== "finished");
  list = [...list].sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""));
  return opts.limit ? list.slice(0, opts.limit) : list;
}

const rangeFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" });

/** "Oct 6 – Nov 10", or a single date, or "Dates to be confirmed". */
export function formatSeriesRange(startsAt: string | null, endsAt: string | null) {
  if (!startsAt) return "Dates to be confirmed";
  const start = rangeFmt.format(new Date(startsAt));
  if (!endsAt) return `From ${start}`;
  return `${start} – ${rangeFmt.format(new Date(endsAt))}`;
}
