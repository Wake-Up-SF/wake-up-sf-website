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
