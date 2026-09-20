// Static sample data used until Supabase is wired (PLAN-components.md §5.3).
// Names, phone and email other than Charisse Yeh are placeholders.
import type { LibraryItem, MemberPost, PublicEvent, PublicSeries, Leader } from "@/lib/types";
import { openLibraryCover } from "./covers";

const year = new Date().getFullYear();
// PDT (UTC-7) March–October, PST (UTC-8) November–February. Good enough for fixtures.
const at = (m: number, d: number, h: number, min = 0) =>
  new Date(Date.UTC(year, m - 1, d, h + (m >= 11 || m <= 2 ? 8 : 7), min)).toISOString();

export const fixtureEvents: PublicEvent[] = [
  { id: "1", title: "Sunday sit in Precita Park", description: "Our weekly sit: sitting, walking, tea and sharing.", type: "weekly_sit", startsAt: at(9, 28, 11), linkUrl: "https://lu.ma/wakeupsf", location: "Precita Park" },
  { id: "2", title: "Day of Mindfulness at Deer Park Monastery", description: "A full day of practice with the monastics. Carpool from SF.", type: "day_of_mindfulness", startsAt: at(10, 11, 9), linkUrl: "https://lu.ma/wakeupsf", location: "Escondido, carpool from SF" },
  { id: "3", title: "Potluck & dharma sharing: beginning anew", description: "Bring a dish and an open heart.", type: "social", startsAt: at(10, 17, 18, 30), linkUrl: "https://partiful.com/wakeupsf", location: "Mission District" },
  { id: "4", title: "Sunday sit in Precita Park", description: "Our weekly sit.", type: "weekly_sit", startsAt: at(10, 19, 11), linkUrl: "https://lu.ma/wakeupsf", location: "Precita Park" },
  { id: "5", title: "Monthly online sit with Wake Up International", description: "Practice with sanghas around the world.", type: "online", startsAt: at(10, 22, 18), linkUrl: "https://lu.ma/wakeupsf", location: "Zoom, link after RSVP" },
  { id: "6", title: "Ocean Beach walking meditation & bonfire", description: "Slow walk on the sand, then a fire.", type: "social", startsAt: at(11, 1, 16), linkUrl: "https://partiful.com/wakeupsf", location: "Ocean Beach, Stairwell 21" },
  { id: "7", title: "Wake Up West Coast retreat: Touching the Earth", description: "Three days of practice in the mountains.", type: "retreat", startsAt: at(11, 7, 17), linkUrl: "https://lu.ma/wakeupsf", location: "Vallecitos Mountain Retreat, NM" },
];

/** Roster from the sign-up Google Sheet (2025–2026 rows). Shrey and Diego are also the Caretaking Council. Update from the sheet; it stays the source of truth. */
const COUNCIL = "Caretaking Council · Facilitator";
const FACILITATOR = "Facilitator";
export const fixtureLeaders: Leader[] = [
  { id: "shrey", name: "Shrey", role: COUNCIL },
  { id: "diego", name: "Diego", role: COUNCIL },
  ...["Jerry", "Sophie", "Charisse", "Michelle", "Kyle", "Meri", "Shreyan", "Diva", "Rachel", "Vivien", "Avery", "Christine", "Stuti", "Brian", "Evan"].map(
    (name) => ({ id: name.toLowerCase(), name, role: FACILITATOR }),
  ),
];

/** Series and their events (hub only). Sample content — replace once the tables are live. */
const seriesEvents: PublicEvent[] = [
  { id: "s1-1", title: "Week 1 · Reading: The Heart of the Buddha's Teaching", description: "Chapters 1–4, then sharing in pairs.", type: "other", startsAt: at(10, 6, 19), linkUrl: "https://lu.ma/wakeupsf", location: "Mission District" },
  { id: "s1-2", title: "Week 2 · The Four Noble Truths", description: "Chapters 5–9.", type: "other", startsAt: at(10, 13, 19), linkUrl: "https://lu.ma/wakeupsf", location: "Mission District" },
  { id: "s1-3", title: "Week 3 · The Noble Eightfold Path", description: "Chapters 10–16.", type: "other", startsAt: at(10, 20, 19), linkUrl: "https://lu.ma/wakeupsf", location: "Mission District" },
  { id: "s2-1", title: "Beginning anew with the Five Mindfulness Trainings", description: "A guided recitation and sharing circle.", type: "day_of_mindfulness", startsAt: at(10, 4, 10), linkUrl: "https://lu.ma/wakeupsf", location: "Precita Park" },
  { id: "s2-2", title: "Deep listening and loving speech", description: "Practising the fourth training together.", type: "day_of_mindfulness", startsAt: at(11, 1, 10), linkUrl: "https://lu.ma/wakeupsf", location: "Precita Park" },
];

export const fixtureSeries: PublicSeries[] = [
  {
    id: "series-book-club",
    slug: "autumn-book-club",
    title: "Autumn book club",
    description:
      "Six Tuesday evenings reading The Heart of the Buddha's Teaching together. Come to as many as you can — there's no catching up to do.",
    cadence: "Six Tuesdays, 7–8:30pm",
    place: "A member's living room in the Mission",
    startsAt: at(10, 6, 19),
    endsAt: at(11, 10, 19),
    status: "running",
    linkUrl: "https://lu.ma/wakeupsf",
    events: seriesEvents.filter((e) => e.id.startsWith("s1-")),
  },
  {
    id: "series-five-trainings",
    slug: "five-trainings",
    title: "The Five Mindfulness Trainings, one by one",
    description:
      "A monthly morning on each of the five trainings, ending with a recitation for anyone who wants to receive them formally.",
    cadence: "First Sunday of the month, 10am",
    place: "Precita Park, before the Sunday sit",
    startsAt: at(10, 4, 10),
    endsAt: at(11, 1, 10),
    status: "upcoming",
    events: seriesEvents.filter((e) => e.id.startsWith("s2-")),
  },
];

/** The lending shelf. Owners are first names; contact goes through the sangha email until members opt in. */
export const fixtureLibrary: LibraryItem[] = [
  { id: "lib-1", cover: openLibraryCover("9780767903691", "The Heart of the Buddha's Teaching"), title: "The Heart of the Buddha's Teaching", author: "Thich Nhat Hanh", kind: "Book", status: "available", note: "The book club copy — annotated in pencil, sorry.", owner: "Charisse", contactHref: "mailto:hello@wakeupsf.org?subject=Library%3A%20The%20Heart%20of%20the%20Buddha%27s%20Teaching" },
  { id: "lib-2", cover: openLibraryCover("9780938077268", "Old Path White Clouds"), title: "Old Path White Clouds", author: "Thich Nhat Hanh", kind: "Book", status: "lent", note: "Back at the end of the month.", owner: "Shrey", contactHref: "mailto:hello@wakeupsf.org?subject=Library%3A%20Old%20Path%20White%20Clouds" },
  { id: "lib-3", cover: openLibraryCover("9780062780171", "No Mud, No Lotus"), title: "No Mud, No Lotus", author: "Thich Nhat Hanh", kind: "Book", status: "available", owner: "Diego", contactHref: "mailto:hello@wakeupsf.org?subject=Library%3A%20No%20Mud%2C%20No%20Lotus" },
  { id: "lib-4", title: "Being Peace", author: "Thich Nhat Hanh", kind: "Zine", status: "available", note: "A photocopied study booklet from the 2022 retreat.", owner: "Michelle", contactHref: "mailto:hello@wakeupsf.org?subject=Library%3A%20Being%20Peace" },
  { id: "lib-5", cover: openLibraryCover("9781888375909", "Awakening of the Heart"), title: "Awakening of the Heart", author: "Thich Nhat Hanh", kind: "Book", status: "wanted", note: "Happy to borrow for a few weeks, or buy a used copy off someone.", owner: "Kyle", contactHref: "mailto:hello@wakeupsf.org?subject=Library%3A%20Awakening%20of%20the%20Heart" },
];

/** Member writing, reshared with permission. A facilitator adds each row. */
export const fixtureMemberPosts: MemberPost[] = [
  { id: "post-1", title: "What three years of Sunday sits taught me about showing up", author: "Charisse", publication: "Substack", publishedAt: at(9, 2, 9), excerpt: "I almost never feel like going. I go anyway, and by the second bell I'm glad.", url: "https://substack.com" },
  { id: "post-2", title: "Walking meditation on a city block", author: "Shrey", publication: "Substack", publishedAt: at(8, 14, 9), excerpt: "Precita Park is easy. The 24 Divisadero at rush hour is the real practice.", url: "https://substack.com" },
  { id: "post-3", title: "Notes from Deer Park, day three", author: "Michelle", publication: "Personal blog", publishedAt: at(7, 29, 9), excerpt: "Nobody told me the silence would be the loud part.", url: "https://substack.com" },
];
