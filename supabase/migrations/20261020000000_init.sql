-- Wake Up SF — initial schema, row level security, storage and seed.
-- Mirrors plans/SETUP-supabase-vercel.md §3a–3d; change both together.

-- Extensions
create extension if not exists "pgcrypto";

-- §3a Schema ------------------------------------------------------------------

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
  role          text not null,           -- e.g. 'Facilitator'
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

-- Sangha Hub (members-only, §6c)

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

-- §3b Row level security ---------------------------------------------------------
-- The anon key can read published events, active leaders, settings and unfinished series,
-- and can insert a pending event. Nobody updates or deletes through the API; facilitators
-- do that in the dashboard, which bypasses RLS.

alter table events        enable row level security;
alter table leaders       enable row level security;
alter table site_settings enable row level security;

create policy "public reads published events" on events
  for select to anon, authenticated
  using (status = 'published');

create policy "public reads active leaders" on leaders
  for select to anon, authenticated
  using (is_active = true);

create policy "public reads settings" on site_settings
  for select to anon, authenticated
  using (true);

-- library_items and member_posts carry members' names and contact links, so they get
-- NO policy at all: the anon key reads nothing; the site reads them server-side with
-- the service-role key inside the gated /sangha routes.
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

-- §3c Storage -------------------------------------------------------------------

insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

-- §3d Seed ----------------------------------------------------------------------
-- The facilitator roster from the sign-up Google Sheet (2025–2026), same order as the site.
-- No phone or contact yet: the (415) 555-0100 number in the docs is a placeholder.

insert into leaders (name, role, sort_order, is_primary_contact) values
  ('Shrey',    'Caretaking Council · Facilitator', 1,  false),
  ('Diego',    'Caretaking Council · Facilitator', 2,  false),
  ('Jerry',    'Facilitator', 10, false),
  ('Sophie',   'Facilitator', 11, false),
  ('Charisse', 'Facilitator', 12, true),
  ('Michelle', 'Facilitator', 13, false),
  ('Kyle',     'Facilitator', 14, false),
  ('Meri',     'Facilitator', 15, false),
  ('Shreyan',  'Facilitator', 16, false),
  ('Diva',     'Facilitator', 17, false),
  ('Rachel',   'Facilitator', 18, false),
  ('Vivien',   'Facilitator', 19, false),
  ('Avery',    'Facilitator', 20, false),
  ('Christine','Facilitator', 21, false),
  ('Stuti',    'Facilitator', 22, false),
  ('Brian',    'Facilitator', 23, false),
  ('Evan',     'Facilitator', 24, false);
