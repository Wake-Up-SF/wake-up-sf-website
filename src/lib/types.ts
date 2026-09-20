export type LinkItem = { label: string; href: string; external?: boolean };
export type NavItem = LinkItem;
export type Img = { src: string; alt: string };

/** events.type enum in Supabase (SETUP-supabase-vercel.md §3a). */
export type EventType =
  | "weekly_sit"
  | "day_of_mindfulness"
  | "retreat"
  | "social"
  | "online"
  | "other";

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  weekly_sit: "Weekly sit",
  day_of_mindfulness: "Day of Mindfulness",
  retreat: "Retreat",
  social: "Social",
  online: "Online",
  other: "Other",
};

/** Mapped, public shape given to components (never a raw row). */
export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startsAt: string | null; // ISO
  linkUrl: string;
  location?: string;
  seriesId?: string; // set when the event belongs to an event series (hub)
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  contact?: string;
  contactHref?: string;
  avatar?: Img;
};

export type Settings = {
  meetingSummary: string;
  meetingPlace: string;
  meetingDirections: string;
  cantFindUsText: string;
  cantFindUsPhone?: string;
  cantFindUsEmail: string;
};

export type DocumentLink = { kind: string; title: string; description: string; href: string };
export type ScheduleStep = { duration: string; title: string; description: string };
export type InfoColumnItem = { title: string; body: string; link?: LinkItem };

/** event_series.status enum in Supabase (SETUP-supabase-vercel.md §3a). */
export type SeriesStatus = "upcoming" | "running" | "finished";

export const SERIES_STATUS_LABEL: Record<SeriesStatus, string> = {
  upcoming: "Starting soon",
  running: "Running now",
  finished: "Finished",
};

/** A run of linked events — a book club, a six-week study group, a retreat weekend. */
export type PublicSeries = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cadence: string; // "Six Tuesdays", "Monthly"
  place: string;
  startsAt: string | null; // ISO
  endsAt: string | null; // ISO
  status: SeriesStatus;
  linkUrl?: string;
  events: PublicEvent[];
};

/** library_items.status enum in Supabase. `wanted` is a member asking to borrow, not offering. */
export type LibraryStatus = "available" | "lent" | "wanted";

export const LIBRARY_STATUS_LABEL: Record<LibraryStatus, string> = {
  available: "On the shelf",
  lent: "Lent out",
  wanted: "Wanted",
};

/** A book (or zine, or audiobook) a member is offering to lend, or hoping to borrow. */
export type LibraryItem = {
  id: string;
  title: string;
  author: string;
  kind: string; // "Book", "Zine", "Audiobook"
  status: LibraryStatus;
  note?: string;
  owner: string; // first name only
  contactHref?: string; // mailto: / sms:
};

/** A member's post, reshared from Substack or wherever they write. Curated by a facilitator. */
export type MemberPost = {
  id: string;
  title: string;
  author: string;
  publication: string; // "Substack", "Personal blog"
  publishedAt: string | null; // ISO
  excerpt: string;
  url: string;
};
