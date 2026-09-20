// Static sample data used until Supabase is wired (PLAN-components.md §5.3).
// Names, phone and email other than Charisse Yeh are placeholders.
import type { Leader, PublicEvent } from "@/lib/types";

const year = new Date().getFullYear();
const at = (m: number, d: number, h: number, min = 0) =>
  new Date(Date.UTC(year, m - 1, d, h + 7, min)).toISOString(); // PDT offset, good enough for fixtures

export const fixtureEvents: PublicEvent[] = [
  { id: "1", title: "Sunday sit in Precita Park", description: "Our weekly sit: sitting, walking, tea and sharing.", type: "weekly_sit", startsAt: at(9, 28, 11), linkUrl: "https://lu.ma/wakeupsf", location: "Precita Park" },
  { id: "2", title: "Day of Mindfulness at Deer Park Monastery", description: "A full day of practice with the monastics. Carpool from SF.", type: "day_of_mindfulness", startsAt: at(10, 11, 9), linkUrl: "https://lu.ma/wakeupsf", location: "Escondido, carpool from SF" },
  { id: "3", title: "Potluck & dharma sharing: beginning anew", description: "Bring a dish and an open heart.", type: "social", startsAt: at(10, 17, 18, 30), linkUrl: "https://partiful.com/wakeupsf", location: "Mission District" },
  { id: "4", title: "Sunday sit in Precita Park", description: "Our weekly sit.", type: "weekly_sit", startsAt: at(10, 19, 11), linkUrl: "https://lu.ma/wakeupsf", location: "Precita Park" },
  { id: "5", title: "Monthly online sit with Wake Up International", description: "Practice with sanghas around the world.", type: "online", startsAt: at(10, 22, 18), linkUrl: "https://lu.ma/wakeupsf", location: "Zoom, link after RSVP" },
  { id: "6", title: "Ocean Beach walking meditation & bonfire", description: "Slow walk on the sand, then a fire.", type: "social", startsAt: at(11, 1, 16), linkUrl: "https://partiful.com/wakeupsf", location: "Ocean Beach, Stairwell 21" },
  { id: "7", title: "Wake Up West Coast retreat: Touching the Earth", description: "Three days of practice in the mountains.", type: "retreat", startsAt: at(11, 7, 17), linkUrl: "https://lu.ma/wakeupsf", location: "Vallecitos Mountain Retreat, NM" },
];

export const fixtureLeaders: Leader[] = [
  { id: "1", name: "Shrey", role: "Caretaking Council" },
  { id: "2", name: "Diego", role: "Caretaking Council" },
];

/** Facilitator roster, pulled from the sign-up Google Sheet (2025–2026 rows). Update from the sheet; it stays the source of truth. */
export const fixtureFacilitators: string[] = [
  "Diego", "Jerry", "Shrey", "Sophie", "Charisse", "Michelle", "Kyle", "Meri", "Shreyan", "Diva",
  "Rachel", "Vivien", "Avery", "Christine", "Stuti", "Brian", "Evan",
];
