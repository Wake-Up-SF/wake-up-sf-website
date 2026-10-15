# Wake Up SF — hosting setup (Supabase + Vercel)

This is the low-maintenance stack for the Wake Up SF site: a small Next.js app on **Vercel** (free Hobby plan) with **Supabase** (free tier) as the database, file storage, and admin UI. No custom admin panel is needed: facilitators approve events directly in the Supabase table editor, or by email link.

Everything below is free, and both services let you transfer ownership to another person in a couple of clicks when leadership rotates.

---

## 1. Why this stack

| Need | How it's covered |
|---|---|
| Public site: home, events, leadership | Next.js pages on Vercel, data read from Supabase |
| Members submit events | Public form → `events` row with `status = 'pending'` |
| Facilitators approve events | Supabase dashboard (table editor) → flip `status` to `published` |
| Leadership directory | `leaders` table, edited in the dashboard |
| Photos for events / leaders | Supabase Storage bucket `media` |
| Members-only Sangha Hub | `/sangha`, behind a second shared password (§6c) |
| Event series (book clubs, study groups) | `event_series` table; each event points at its series |
| Book lending shelf | `library_items` table, read server-side only |
| Member writing reshared from Substack | `member_posts` table, one row per post, added by hand |
| Free, transferable, low upkeep | Both dashboards support ownership transfer; nothing to patch or babysit |

Alternative considered: Firebase. It works, but Supabase is plain Postgres (easy to export and move), has a spreadsheet-like table editor facilitators can use without training, and row-level security is simpler to reason about for a small public site.

---

## 2. Accounts and ownership

Create both accounts with a **shared sangha email** (for example `hello@wakeupsf.org` on a free Google Workspace or a plain Gmail), not a personal address. This is the single most important step for transferability. Store the login in the facilitators' shared password manager.

1. **GitHub**: create an organization `wakeup-sf` and put the repo there. Add each facilitator as an owner.
2. **Supabase** (https://supabase.com): sign in with the GitHub org account. Create an organization called `Wake Up SF` (free plan). Projects inside an org can be transferred and the org can have multiple owners: Settings → Team → invite facilitators as Owner.
3. **Vercel** (https://vercel.com): sign in with GitHub. The Hobby plan is free for non-commercial use, which this qualifies for. Note: Hobby accounts are personal, so create it under the shared sangha account. If you later want multiple owners, Vercel Pro (paid) is required; the free workaround is simply sharing the sangha login.

---

## 3. Create the Supabase project

1. Dashboard → **New project**. Name `wakeup-sf`, region `West US (North California)`, generate a strong database password and save it in the password manager.
2. Wait for the project to finish provisioning (about two minutes).
3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key (safe for the browser)
   - `service_role` key (server only, never commit it)

### 3a. Schema

Open **SQL Editor → New query**, paste, and run:

```sql
-- Extensions
create extension if not exists "pgcrypto";

-- Enum for event lifecycle
create type event_status as enum ('pending', 'published', 'rejected', 'archived');

-- Enum for event type (matches the filter chips in the design)
create type event_type as enum ('weekly_sit', 'day_of_mindfulness', 'retreat', 'social', 'online', 'other');

-- Events. Members submit only a title, description and a Luma/Partiful link;
-- facilitators fill in the rest (type, date, cover) when approving, if they want to.
create table events (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  status          event_status not null default 'pending',
  title           text not null,
  description     text not null,
  link_url        text not null,        -- Luma or Partiful page: RSVPs, date, location live there
  type            event_type not null default 'other',   -- set by facilitator on approval
  starts_at       timestamptz,          -- set by facilitator on approval; used for ordering and "This Sunday"
  cover_image_path text,                -- optional, uploaded by facilitator to the 'media' bucket
  review_note     text,                 -- facilitator note, not shown publicly
  constraint title_length check (char_length(title) between 3 and 140),
  constraint link_is_luma_or_partiful check (
    link_url ~* '^https://(lu\.ma|luma\.com|www\.luma\.com|partiful\.com|www\.partiful\.com)/'
  )
);

create index events_published_idx on events (starts_at) where status = 'published';

-- Leadership directory
create table leaders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  role          text not null,           -- e.g. 'Group facilitator'
  bio           text,
  contact       text,                    -- shown publicly, e.g. 'Text (415) 555-0100'
  contact_href  text,                    -- e.g. 'sms:+14155550100' or 'mailto:...'
  photo_path    text,                    -- path in 'media' bucket
  sort_order    int not null default 100,
  is_active     boolean not null default true,
  is_primary_contact boolean not null default false  -- the "can't find us?" person
);

-- Site settings as a single row (meeting time, place, fallback contact)
create table site_settings (
  id                 int primary key default 1 check (id = 1),
  meeting_summary    text not null default 'Every Sunday, 11:00am',
  meeting_place      text not null default 'Precita Park, Bernal Heights',
  meeting_directions text default 'Look for the circle of cushions on the grass near the Folsom St side of the park.',
  cant_find_us_text  text default 'Text the facilitator on the day and someone will come find you.',
  cant_find_us_phone text,
  cant_find_us_email text default 'hello@wakeupsf.org',
  updated_at         timestamptz not null default now()
);
insert into site_settings (id) values (1);

-- Sangha Hub (members-only, §6c) --------------------------------------------

-- A run of events that belong together: a six-week book club, a monthly study morning.
create type series_status as enum ('upcoming', 'running', 'finished');

create table event_series (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  slug        text not null unique,
  title       text not null,
  description text not null,
  cadence     text not null,          -- 'Six Tuesdays, 7–8:30pm'
  place       text not null,
  starts_at   timestamptz,
  ends_at     timestamptz,
  status      series_status not null default 'upcoming',
  link_url    text                    -- optional RSVP page for the whole series
);

-- Each event may belong to one series; a session list is just the events with that series_id.
alter table events add column series_id uuid references event_series (id) on delete set null;
create index events_series_idx on events (series_id, starts_at);

-- The lending shelf. `wanted` rows are members asking to borrow, not offering.
create type library_status as enum ('available', 'lent', 'wanted');

create table library_items (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  author       text not null,
  kind         text not null default 'Book',   -- Book, Zine, Audiobook
  status       library_status not null default 'available',
  note         text,
  owner        text not null,                  -- first name only
  contact_href text,                           -- mailto:/sms: — a member's own contact
  cover_path   text,                           -- optional: a cover uploaded to the 'media' bucket
  isbn         text,                           -- optional: 10 or 13 digits, used only to find a cover
  is_active    boolean not null default true
);

-- Member writing, reshared with permission. A facilitator adds each row; nothing is imported.
create table member_posts (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  author       text not null,
  publication  text not null default 'Substack',
  published_at timestamptz,
  excerpt      text not null default '',
  url          text not null,
  is_published boolean not null default true
);

-- Keep updated_at fresh
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger events_updated_at before update on events for each row execute function set_updated_at();
create trigger settings_updated_at before update on site_settings for each row execute function set_updated_at();
```

### 3b. Row Level Security

Run this next. The public (anon key) can read published events and active leaders, and can insert a pending event. Nobody can update or delete through the API; facilitators do that in the dashboard, which bypasses RLS.

```sql
alter table events        enable row level security;
alter table leaders       enable row level security;
alter table site_settings enable row level security;

-- Public read
create policy "public reads published events" on events
  for select to anon, authenticated
  using (status = 'published');

create policy "public reads active leaders" on leaders
  for select to anon, authenticated
  using (is_active = true);

create policy "public reads settings" on site_settings
  for select to anon, authenticated
  using (true);

-- Sangha Hub tables. Series are harmless to expose (they are the same events, grouped);
-- the library and member writing carry members' names and contact links, so they get
-- NO policy at all: with RLS on and no policy, the anon key can read nothing. The site
-- reads them server-side with the service-role key, inside the password-gated /sangha routes.
alter table event_series  enable row level security;
alter table library_items enable row level security;
alter table member_posts  enable row level security;

create policy "public reads series" on event_series
  for select to anon, authenticated
  using (status <> 'finished');

-- Public submit: pending only, and only the three member fields may be set
create policy "public submits pending events" on events
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and starts_at is null
    and cover_image_path is null
    and review_note is null
  );
```

Optional hardening: create a view `public_events` that excludes `review_note`, and point the site at the view instead of the table. If you skip this, make sure the site never selects that column.

### 3c. Storage

1. **Storage → New bucket** → name `media`, set **Public bucket** on.
2. Add policies (Storage → Policies → `media`):

```sql
-- Anyone can view
create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

```

Facilitators upload leader photos to `leaders/` and optional event covers to `events/` from the dashboard. Members never upload files.

### 3d. Seed the leadership table

Table editor → `leaders` → Insert row. Or run:

```sql
insert into leaders (name, role, bio, contact, contact_href, sort_order, is_primary_contact) values
('Charisse Yeh', 'Group facilitator', 'Holds the Sunday sit and is the person to text if you can''t find us.', 'Text (415) 555-0100', 'sms:+14155550100', 1, true);
update site_settings set cant_find_us_phone = '(415) 555-0100';
```

---

## 4. The Next.js app

If you have not scaffolded the site yet:

```bash
npx create-next-app@latest wakeup-sf --typescript --app --tailwind --eslint --src-dir
cd wakeup-sf
npm install @supabase/supabase-js @supabase/ssr
```

Suggested structure (mirrors the Figma screens):

```
src/
  app/
    page.tsx                 # Home
    events/page.tsx          # Events list + "This Sunday"
    events/submit/page.tsx   # Submit an event form
    leadership/page.tsx      # Leadership directory
    api/submit-event/route.ts  # server route that inserts + emails
  lib/supabase/
    client.ts                # browser client (anon key)
    server.ts                # server client (anon key, cookies) — service role only in the route if needed
  components/                # Button, TagPill, EventCard, LeaderCard, SiteHeader, SiteFooter, InputField
```

Environment variables (`.env.local`, and later in Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # only if a server route needs to bypass RLS
NOTIFY_EMAIL=hello@wakeupsf.org         # where new-submission emails go
RESEND_API_KEY=re_...                   # optional, see §6
```

Reading data (server component example):

```ts
// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// src/app/events/page.tsx
const { data: events } = await supabase
  .from('events')
  .select('id,type,title,description,starts_at,link_url,cover_image_path')
  .eq('status', 'published')
  .gte('starts_at', new Date().toISOString())
  .order('starts_at')
```

Use `export const revalidate = 300` on the pages so Vercel caches for five minutes; that keeps the site fast and well under Supabase free-tier limits.

Submitting an event: the form has three fields (title, description, Luma or Partiful link) and posts to `/api/submit-event`, which checks the link's host, inserts with the anon key (RLS forces `status = 'pending'`), and sends the notification email. Add a honeypot field and Cloudflare Turnstile (free) to keep spam out. Each published event card links straight to the Luma/Partiful page for RSVPs.

Design tokens: the CSS custom properties in wkup.org's theme are the same names used for the Figma variables, so `globals.css` can start with:

```css
:root {
  --bg:#F8F3EA; --bg-alt:#F1E8D8; --ink:#2B2A25; --ink-soft:#4A4842; --ink-faint:#7A776C;
  --clay:#7A5233; --clay-dark:#55381F; --sage:#4F6F52; --sage-dark:#2E3F2F; --sage-light:#D8E2D2;
  --sand:#E7D6A9; --sand-text:#7A5B22; --dust-blue:#D3B896; --rule:#E7DFCF; --white:#FFFFFF; --footer-bg:#2B2A25;
  --radius-sm:10px; --radius-md:16px; --radius-lg:20px; --radius-pill:999px;
  --font-body:"Work Sans", system-ui, sans-serif;
}
```

---

## 5. Deploy to Vercel

1. Push the repo to the `wakeup-sf` GitHub org.
2. Vercel → **Add New → Project** → import the repo. Framework preset: Next.js. Leave build settings default.
3. **Environment Variables**: add the values from §4 for Production and Preview.
4. Deploy. Every push to `main` redeploys; pull requests get preview URLs.
5. **Domain**: Settings → Domains → add `wakeupsf.org` (or a subdomain under wkup.org if Wake Up International prefers, e.g. `sf.wkup.org`; ask them to add the CNAME Vercel shows).

Optional Supabase ↔ Vercel integration: Supabase dashboard → Integrations → Vercel. It syncs the env vars automatically, which is handy when keys are rotated.

---

## 6. Notifications (so submissions don't sit unnoticed)

Pick one. Both are free at this volume.

**Option A — Database webhook → email (no code in the app).**
Supabase → Database → Webhooks → new webhook on `events` INSERT → HTTP request to a Resend "send email" endpoint, or to a Zapier/Make free-tier hook that emails the facilitators. Simplest to hand over.

**Option B — Send from the API route.**
In `/api/submit-event`, after the insert, call Resend (https://resend.com, free 3k emails/month) with a link to the row:
`https://supabase.com/dashboard/project/<ref>/editor/<events-table-id>?filter=id:eq:<row-id>`

Either way the facilitator opens the row, checks the link, optionally sets `type` and `starts_at` (so it sorts by date and can appear as "This Sunday"), sets `status` to `published` (or `rejected` with a `review_note`), and it appears on the site within five minutes.

---

## 6b. Facilitators page (password-protected)

The Facilitators page is a simple hub: links to the sign-up Google Sheet, the facilitator guide, the charter, the Sangha Hub, the Google Group and the WhatsApp group. Nothing is imported from the sheet — the sheet stays the source of truth and the page just links to it.

**Password gate.** One shared password, checked by Next.js middleware, stored as a cookie for 30 days. No accounts, no Supabase Auth. Rotate it by changing one env var in Vercel and telling the WhatsApp group.

```
FACILITATOR_PASSWORD=change-me        # add in Vercel → Settings → Environment Variables
FACILITATOR_COOKIE_SECRET=long-random-string
MEMBER_PASSWORD=change-me-too         # the Sangha Hub password, shared with the whole sangha (§6c)
MEMBER_COOKIE_SECRET=another-long-random-string
```

Both gated areas share one mechanism. `src/lib/gate.ts` declares them and `src/proxy.ts`
(Next 16's middleware) enforces both:

```ts
// src/lib/gate.ts
export const gates = {
  facilitators: { base: '/facilitators', enter: '/facilitators/enter', cookie: 'wusf_fac',
                  passwordEnv: 'FACILITATOR_PASSWORD', secretEnv: 'FACILITATOR_COOKIE_SECRET' },
  sangha:       { base: '/sangha',       enter: '/sangha/enter',       cookie: 'wusf_member',
                  passwordEnv: 'MEMBER_PASSWORD',      secretEnv: 'MEMBER_COOKIE_SECRET' },
}

// src/proxy.ts
export const config = { matcher: ['/facilitators/:path*', '/sangha/:path*'] }
export function proxy(req: NextRequest) {
  const gate = gateFor(req.nextUrl.pathname)          // which area, if any
  if (!gate || req.nextUrl.pathname.startsWith(gate.enter)) return NextResponse.next()
  if (req.cookies.get(gate.cookie)?.value === process.env[gate.secretEnv]) return NextResponse.next()
  const url = req.nextUrl.clone(); url.pathname = gate.enter; url.search = ''
  url.searchParams.set('next', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}
```

The password form's server action is a two-line wrapper around the shared `enterGate` helper
(`src/lib/gate-server.ts`), which checks the password, sets the area's cookie for 30 days and
redirects. The `next` parameter is clamped to the area that was just unlocked, so a `next` pointing
at another area or at an external host lands on the area's own index instead.

```ts
// src/app/facilitators/enter/actions.ts
'use server'
import { enterGate, type EnterState } from '@/lib/gate-server'
export async function enterFacilitators(_prev: EnterState, formData: FormData) {
  return enterGate('facilitators', formData)
}
// src/app/sangha/enter/actions.ts is the same with 'sangha'.
```

Add `<meta name="robots" content="noindex">` on both pages. Documents live in `public/docs/` (copied from the repo-root `docs/`); they're technically reachable by URL if someone guesses the path, so keep the gate as a courtesy wall rather than a security boundary. If that matters, serve them through a route handler that checks the same cookie.

| Card | Link |
|---|---|
| Facilitation schedule | https://docs.google.com/spreadsheets/d/1LAdQSl6vVc29QtajIRBSBcpI2jLI2c6SUo8UcYbMerY/edit?gid=2021187044 |
| Facilitator Guide (Dec 2022) | `public/docs/facilitator-guide-2022.docx` (export a PDF for easier viewing) |
| Charter (2020) | `public/docs/charter-2020.pdf` |
| Sangha Hub | https://level-sage-67b.notion.site/Sangha-Hub-1d20457965ca804e8c34f75cc731bda0 |
| Google Group | https://groups.google.com/g/wake-up-san-francisco/about |
| WhatsApp group | https://chat.whatsapp.com/DcB40QkcgZOKmJXRdb3de1 |

The Sangha Hub page mentions account ownership details. Link to it, but don't copy those into the site.

---

## 6c. Sangha Hub (members-only)

`/sangha` is the members' side of the site, behind a **second, different password** from the
facilitator hub. The facilitator password stays narrow (it opens the guide, the charter and the
account details); the member password is shared with the whole sangha at the Sunday sit. Neither
cookie opens the other area.

| Route | What's on it | Data |
|---|---|---|
| `/sangha` | Overview: series running, recent books, latest writing, a pointer to resources | `event_series`, `library_items`, `member_posts` |
| `/sangha/series` | Each series with its sessions and RSVP links | `event_series` + `events.series_id` |
| `/sangha/library` | The lending shelf: on the shelf / lent out / wanted | `library_items` |
| `/sangha/writing` | Member posts reshared from Substack and elsewhere | `member_posts` |
| `/sangha/resources` | Curated recommendations, grouped | `src/config/site.ts` |

Running it:

- **A new series**: insert an `event_series` row, then set `series_id` on the events that belong to
  it. Published events keep appearing on the public `/events` page as well — a series only groups them.
- **A book**: insert a `library_items` row (title, author, `owner`, `contact_href`, `status`). When a
  book changes hands, flip `status` between `available` and `lent`. A member hoping to borrow is a
  row with `status = 'wanted'`.
- **Its cover**: type the `isbn` and the cover comes from Open Library automatically
  (`covers.openlibrary.org`, free and without a key — allowed in `next.config.ts`). For a zine, a
  translation or anything Open Library doesn't have, upload a photo of the cover to `media/library/`
  and put the path in `cover_path`; it wins over the ISBN. Neither is required — a book with no cover
  shows a blank spine.
- **A post**: insert a `member_posts` row with the title, author, publication, link and a one-line
  excerpt. Ask the author first — nothing is pulled from Substack automatically, by design.
- **Resources** live in `site.sangha.resources.groups` in `src/config/site.ts`, so they are a pull
  request rather than a database edit. Move them to a table if the list starts changing weekly.

**Privacy.** `library_items` and `member_posts` contain members' names and contact links, so they
have RLS enabled with **no read policy at all** (§3b): the anon key cannot read them from the
browser. The site reads them server-side with the service-role key inside the gated routes. All hub
pages are `robots: noindex, nofollow` (set once in `src/app/sangha/layout.tsx`). The password itself
is still a courtesy wall, not a security boundary — don't put anything on the hub that would be
harmful if a member forwarded the password.

---

## 7. Free-tier limits and the one gotcha

| Limit | Free tier | Wake Up SF usage |
|---|---|---|
| Supabase database | 500 MB | Kilobytes |
| Supabase storage | 1 GB | A few hundred photos |
| Supabase bandwidth | 5 GB / month | Fine with Vercel caching |
| Vercel bandwidth | 100 GB / month | Fine |

**The gotcha: Supabase pauses free projects after 7 days with no API activity.** The site then errors until someone clicks "Restore" in the dashboard. Prevent it with a keep-alive ping:

- Add `vercel.json` with a daily cron hitting a tiny route that runs `select 1` against Supabase:

```json
{ "crons": [{ "path": "/api/keepalive", "schedule": "0 12 * * *" }] }
```

```ts
// src/app/api/keepalive/route.ts
import { supabase } from '@/lib/supabase/server'
export async function GET() {
  const { error } = await supabase.from('site_settings').select('id').limit(1)
  return Response.json({ ok: !error })
}
```

Hobby-plan crons run once a day, which is enough. Real traffic to the site also counts as activity.

---

## 8. Handoff checklist (when facilitators rotate)

1. Add the new facilitator as Owner in Supabase (Org → Team) and in the GitHub org.
2. Share the sangha email + password-manager vault.
3. Update the `leaders` table and `site_settings.cant_find_us_phone`.
4. Remove the departing facilitator from both.
4b. Rotate `FACILITATOR_PASSWORD` in Vercel and tell the WhatsApp group. Rotate `MEMBER_PASSWORD`
   about once a year, or when someone leaves on bad terms, and announce the new one at the Sunday sit.
5. Once a year: Supabase → Database → Backups → download, or run `pg_dump` with the connection string, and put the file in the shared Drive. Free tier keeps no daily backups, so this is the safety net.

If you ever need to leave Supabase, the whole thing is standard Postgres plus a folder of images: `pg_dump` the schema and data, download the `media` bucket, and restore anywhere.

---

## 9. Files in this repo

- `plans/SETUP-supabase-vercel.md` — this guide
- `plans/DESIGN-SYSTEM.md` — tokens, typography, components (Direction B)
- `plans/PLAN-components.md` — front-end build plan
- `assets/` (repo root) — Wake Up wordmark (logo.png, logo-white.png) and photos
- `docs/` (repo root) — facilitator guide (Dec 2022) and charter (2020), to be served from `public/docs/`
- Figma: https://www.figma.com/design/VQ4hadDgL9lSzsdiX0Mk0B — pages "🌿 Direction B · Plum Village" (screens: Home, Events, Facilitator hub, Facilitators · Password, each at desktop/tablet/mobile) and "🌿 Direction B · Components" (component set)
