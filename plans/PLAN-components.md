# Wake Up SF — front-end build plan (Next.js + React + Tailwind, Direction B)

This plan turns the Figma pages **"🌿 Direction B · Plum Village"** (screens) and **"🌿 Direction B · Components"** into a small, modular Next.js app. Tokens, typography and components are specified in `DESIGN-SYSTEM.md`; this document covers structure, composition, data and build order. Hosting and data are in `SETUP-supabase-vercel.md`.

Repository: https://github.com/Wake-Up-SF/wake-up-sf-website. The Next.js app lives at the repo root with the tree in §4.

The codebase contains **only** the Direction B system: nine colors, ten text styles, the fourteen components in `DESIGN-SYSTEM.md` §6. Nothing from Direction A (site header/footer, cards, pills, wave hero, sage/sand/dust tokens) is built.

---

## 0. Decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router, TypeScript, `src/` dir (`src/proxy.ts` replaces `middleware.ts`) | Server components read Supabase directly; ISR keeps the free tier idle. |
| Styling | Tailwind CSS **v4** | Tokens declared once in CSS `@theme` become both CSS variables and utilities. No config file to sync. |
| Variants | `class-variance-authority` + `tailwind-merge` via `cn()` | Typed variant props that mirror Figma variant names (`type="event"` ↔ `Type=Event`). |
| Icons | `lucide-react` (`Menu`, `X`, `ArrowRight` only) | Three icons in the whole design. |
| Fonts | `next/font/google`: Work Sans 400/600, EB Garamond 400/600 | Exactly the weights the nine styles use; self-hosted, no layout shift. |
| Content | Static copy in `src/config/site.ts`; live data from Supabase | Non-developers change meeting info, links and nav in one file. |
| Forms | Server actions + `zod` | No client bundle for the two forms; validation shared with the API. |
| Direction switch | None | Direction B only. No theme toggle, no legacy components. |

---

## 1. Tokens

`src/styles/tokens.css` is the token layer (full block in `DESIGN-SYSTEM.md` §5). Excerpt:

```css
@theme {
  --color-white: #FFFFFF;  --color-bg: #F8F3EA;  --color-bg-alt: #F1E8D8;
  --color-ink: #2B2A25;    --color-ink-soft: #4A4842;  --color-ink-faint: #7A776C;
  --color-clay: #7A5233;   --color-clay-dark: #55381F; --color-rule: #E7DFCF;
  --color-surface: var(--color-white);  --color-text: var(--color-ink);  --color-accent: var(--color-clay); /* … */
  --text-h3: 22px; --text-body-3: 14px; --text-display: 48px; --text-lede: 24px; /* … */
  --spacing: 1px; --radius-sm: 4px; --breakpoint-md: 834px; --breakpoint-xl: 1440px;
}
```

Rules that keep it honest:

- Components use semantic aliases only (`bg-surface`, `text-text-muted`, `text-accent`, `border-rule`). Palette names appear only inside `tokens.css`.
- `--spacing: 1px` so `gap-24` is 24px and every Figma value is usable as-is. Only the values listed in `DESIGN-SYSTEM.md` §4 are allowed.
- `tokens.ts` is generated (`scripts/gen-tokens.ts`, run in `prebuild`) for OG images and email only.

---

## 2. Typography in code

Nine utilities, no overrides:

| Figma | Utility |
|---|---|
| Heading 1 / 2 / 3 | `text-h1` `text-h2` `text-h3` |
| Heading 4 (links, actions) | `text-h4 text-accent` |
| Body 1 / 2 / 3 | `text-body-1` `text-body-2` `text-body-3` |
| Display · Serif | `font-serif text-display-sm md:text-display-md xl:text-display` |
| Lede · Serif | `font-serif text-lede-sm md:text-lede-md xl:text-lede` |

Two thin components hold the responsive serif pairing and the semantic element:

```tsx
// src/components/ui/Heading.tsx
const heading = cva('text-text', {
  variants: {
    level: {
      display: 'font-serif text-display-sm md:text-display-md xl:text-display',
      2: 'text-h2',
      3: 'text-h3',
      4: 'text-h4',   // link/action style; ArrowLink and ListRow actions use it in accent
    },
    tone: { default: 'text-text', muted: 'text-text-muted', accent: 'text-accent' },
  },
  defaultVariants: { level: 2, tone: 'default' },
})
export function Heading({ level, tone, as, className, ...rest }: Props) {
  const Tag = as ?? (level === 'display' ? 'h1' : (`h${level}` as const))
  return <Tag className={cn(heading({ level, tone }), className)} {...rest} />
}
```

```tsx
// src/components/ui/Text.tsx
const text = cva('', {
  variants: {
    size: { lede: 'font-serif text-lede-sm md:text-lede-md xl:text-lede', 1: 'text-body-1', 2: 'text-body-2', 3: 'text-body-3' },
    tone: { default: 'text-text', muted: 'text-text-muted', faint: 'text-text-faint', accent: 'text-accent' },
  },
  defaultVariants: { size: 2, tone: 'default' },
})
```

There is no `weight` or `italic` prop. Lint forbids `font-*`, `italic`, `uppercase`, `tracking-*`, and any `text-` size outside the ten tokens (`DESIGN-SYSTEM.md` §10).

---

## 3. Component inventory

One Figma component → one file under `src/components/editorial/`. Props are typed and named after the Figma properties. Figma `Breakpoint` variants become responsive classes inside the component; page files carry no breakpoint prefixes.

| File | Figma | Props | Client? |
|---|---|---|---|
| `editorial/TopNav.tsx` | Top Nav | `items: NavItem[]`, `active: string` | yes (sticky rule, menu sheet) |
| `editorial/MenuSheet.tsx` | (Top Nav mobile behaviour) | `items`, `footerColumns` | yes |
| `editorial/ArrowLink.tsx` | Arrow Link | `label`, `href`, `external?` | no |
| `editorial/Button.tsx` | Button | `variant: 'filled' \| 'outline'`, `href?`, `type?`, children | no |
| `editorial/SectionLabel.tsx` | Section Label | `label` | no |
| `editorial/InfoColumn.tsx` | Info Column | `title`, `body`, `link?: LinkItem` | no |
| `editorial/SubNav.tsx` | Sub Nav | `group`, `items: LinkItem[]` (≤ 6), `active?` | yes (sticky, scroll-spy) |
| `editorial/BrandBlock.tsx` | Brand Block | `wordmark?` (default `'san francisco \u2665\uFE0E'`) | no |
| `editorial/PageHeader.tsx` | Page Header | `title`, `lede`, `links?: LinkItem[]` (0–2) | no |
| `editorial/SplitHero.tsx` | Split Hero | `nav`, `active`, `title`, `lede`, `links?`, `image?: Img` | no |
| `editorial/ListRow.tsx` | List Row | `type: 'event' \| 'person' \| 'document' \| 'step'` + per-type fields (`lead/title/meta/action`, `name/role/contact/avatar?`, `kind/title/description/action`, `duration/title/description`) | no |
| `editorial/Figure.tsx` | Figure | `src`, `alt`, `caption`, `priority?` | no |
| `editorial/PullQuote.tsx` | Pull Quote | `quote`, `attribution` | no |
| `editorial/FooterB.tsx` | Footer B | `description`, `columns`, `bottomLinks` | no |
| `editorial/PasswordGate.tsx` | Password Gate (gate card) | `action` (the area's server action), `copy: GateCopy`, `fallback: string`, `error?: boolean`, `next?: string` | yes (`useActionState`) |
| `ui/Heading.tsx`, `ui/Text.tsx` | — (type scale) | see §2 | no |
| `ui/Container.tsx` | — (gutters + 1296) | children | no |
| `ui/Section.tsx` | — (vertical rhythm + optional top rule) | `rule?: boolean`, children | no |
| `ui/Article.tsx` | — (Sub Nav + 760 column layout) | `subnav`, children | no |
| `ui/Input.tsx` | Input Field (legacy) | label, placeholder, error | no |

Shared types (`src/lib/types.ts`): `LinkItem {label, href}`, `NavItem = LinkItem`, `Img {src, alt}`, `PublicEvent`, `Leader`, `Settings`, `DocumentLink {kind, title, description, href}`, `ScheduleStep {duration, title, description}`.

**Wordmark**: `BrandBlock` renders `san francisco ♥` with the heart as U+2665 + U+FE0E and `[font-variant-emoji:text]`. Never the emoji. Full note in `DESIGN-SYSTEM.md` §7.

---

## 4. Folder structure and rules

```
src/
  app/
    layout.tsx  globals.css  page.tsx
    events/page.tsx
    facilitators/page.tsx  facilitators/enter/page.tsx  facilitators/enter/actions.ts
    sangha/layout.tsx  sangha/page.tsx  sangha/enter/page.tsx  sangha/enter/actions.ts
    sangha/series/page.tsx  sangha/library/page.tsx  sangha/writing/page.tsx  sangha/resources/page.tsx
    api/keepalive/route.ts
  proxy.ts
  components/
    ui/         Heading Text Container Section Article Input
    editorial/  TopNav MenuSheet ArrowLink Button SectionLabel InfoColumn SubNav
                BrandBlock PageHeader SplitHero ListRow Figure PullQuote FooterB PasswordGate
  config/site.ts
  lib/
    cn.ts  types.ts  validation.ts  gate.ts (gate config, shared with proxy.ts)  gate-server.ts (cookie + redirect)
    data/  events.ts leaders.ts settings.ts series.ts library.ts posts.ts fixtures.ts
    supabase/  server.ts
  styles/  tokens.css  tokens.ts (generated)
scripts/gen-tokens.ts
public/
  images/  logo.png  hero-weekly-meditation.jpg  photo-walking.jpg  photo-pv-countryside.jpg  photo-pv-talk.jpg
  docs/    facilitator-guide-2022.pdf  charter-2020.pdf
```

Naming: `PascalCase` component files, one named export per file, variant values mirror Figma in camelCase (`Type=Event` → `type="event"`). Copy props are named for role (`title`, `lede`, `body`), not style.

Rules:

1. No hex, `rgb`, or palette class names in components — semantic aliases only.
2. No outer margins on components; parents use `gap`.
3. No page-specific classNames inside components; a difference is a new prop or a layout-only `className` passthrough.
4. Every component exports its `cva` definition.
5. Server by default. Client components: `TopNav`, `MenuSheet`, `SubNav`, `PasswordGate`.
6. Copy lives in `site.config.ts` or the database, never as literals in components.
7. Text only via the nine utilities; no weight, italic, case or tracking overrides. Links and actions are `text-h4 text-accent`.
8. Lint enforces 1, 2, 7 (rules in `DESIGN-SYSTEM.md` §10).

---

## 5. Page composition

Pages own layout and data-fetching; sections own presentation; components own their props.

### 5.1 Content sources

| Content | Source | Edited by |
|---|---|---|
| Meeting time, place, directions, can't-find-us contact | `site_settings` row (fallback in `site.config.ts`) | Facilitators, in the Supabase dashboard |
| Events | `events` table (published only) | Members submit, facilitators approve |
| Leaders / Caretaking Council | `leaders` table | Facilitators |
| Event series (hub) | `event_series` table, events joined by `events.series_id` | Facilitators |
| Sangha library | `library_items` table (members-only: no public read policy) | Facilitators, from members' offers |
| Member writing | `member_posts` table (members-only: no public read policy) | Facilitators, by hand — nothing is imported from Substack |
| Hub resources & recommendations | `site.sangha.resources.groups` in `src/config/site.ts` | Anyone comfortable editing one file |
| Nav, footer columns, wordmark, Who-we-are copy, quote, Get-involved copy, facilitator guidelines, Sunday-at-a-glance steps, document links | `src/config/site.ts` | Anyone comfortable editing one file |
| Photos | `public/images/` | — |

```ts
// src/config/site.ts — the one file non-developers edit
export const site = {
  name: 'Wake Up San Francisco',
  wordmark: 'san francisco ♥︎',          // U+2665 + text presentation selector, never the emoji
  nav: [
    { label: 'Home', href: '/' }, { label: 'About', href: '/#about' },
    { label: 'Events', href: '/events' }, { label: 'Facilitators hub', href: '/facilitators' },
  ],
  meeting: { summary: 'Sundays 11am in Precita Park', place: 'Precita Park, Bernal Heights',
    directions: 'Look for the circle of picnic blankets on the grass near the Folsom St side of the park.' },
  contact: { email: 'hello@wakeupsf.org', phoneDisplay: '(415) 555-0100', phoneHref: 'sms:+14155550100' },
  home: {
    lede: 'Wake Up SF is a community of young adults (18–35) practicing mindfulness together …',
    infoColumns: [ { title: 'Every Sunday, 11:00am', body: '…', link: { label: "Can't find us? Message us →", href: '#contact' } },
                   { title: 'Who we are', body: '…', link: { label: 'Learn about Wake Up →', href: '#about' } } ],
    about: { subnav: { group: 'About', items: [/* Who we are, Facilitators & community, The practice */] },
             lede: '…', paragraphs: ['…'], figure: { src: '/images/hero-weekly-meditation.jpg', alt: '…', caption: 'Sitting meditation in the park' },
             quote: { text: 'The most precious gift we can offer anyone is our attention …', attribution: 'Thich Nhat Hanh' },
             links: [/* Read about the practice →, Find Wake Up worldwide → */] },
    community: { lede: '…', paragraph: '…', getInvolved: '…', links: [/* Meet the whole team →, Join the WhatsApp group →, Facilitator hub (password) → */] },
  },
  events: { lede: '…', filters: ['All', 'Weekly sit', 'Day of Mindfulness', 'Retreat', 'Social', 'Online'], links: [/* Submit an event →, Past events → */] },
  facilitators: {
    lede: '…',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1LAdQSl6vVc29QtajIRBSBcpI2jLI2c6SUo8UcYbMerY/edit?gid=2021187044',
    infoColumns: [/* Who's facilitating, New to facilitating? */],
    schedule: [ { duration: '5–10 min', title: 'Check-in', description: 'Names, pronouns, internal weather.' } /* … */ ],
    container: '…',                                   // "Creating a container" paragraph
    documents: [ { kind: 'Google Sheet', title: 'Facilitation schedule', description: '…', href: '…' } /* … */ ],
    support: { quote: '…', attribution: 'Contact the CTC →' },
  },
  footer: {
    description: 'Young practitioners in the Plum Village tradition, meeting every Sunday at 11am in Precita Park. A local branch of Wake Up International.',
    columns: [ { label: '— About', links: [/* … */] }, { label: '— Community', links: [/* … */] }, { label: '— Connect', links: [/* … */] } ],
    bottomLinks: [ { label: 'Privacy', href: '/privacy' }, { label: 'Code of conduct', href: '/code-of-conduct' }, { label: 'wkup.org', href: 'https://wkup.org' } ],
  },
} as const
```

### 5.2 Routes and page recipes

| Route | Sections (top → bottom) | Data |
|---|---|---|
| `/` | `SplitHero` (nav · brand · Page Header "Sundays 11am in Precita Park" · photo) → 2 × `InfoColumn` → `Article` with `SubNav` "About" + `Heading display` "Who we are", `Text lede`, paragraphs, `Figure`, `PullQuote`, `ArrowLink`s → `Article` "Facilitators & community": lede, paragraph, `SectionLabel` "Caretaking Council", `ListRow type="person"` ×3, `Heading 3` "Get involved" + paragraph, `ArrowLink`s → `Section` with `Heading 2` "Upcoming events" + "All events →" and `ListRow type="event"` ×3 → `FooterB` | `getSettings()`, `getLeaders(3)`, `getUpcomingEvents(3)` |
| `/events` | `TopNav` + `BrandBlock` + `PageHeader` "Events" (no photo; links Submit an event →, Past events →) → `Article` with `SubNav` "Events" (type filter, synced to `?type=`) + `Heading display` "Coming up", `Text lede`, `Figure`, then per month `SectionLabel` + `ListRow type="event"`, `ArrowLink` "See past events →" → `FooterB` | `getUpcomingEvents({ type })` grouped by month |
| `/facilitators` (gated) | `SplitHero` "Facilitator hub" (links Open the sign-up sheet →, Read the facilitator guide →) → 2 × `InfoColumn` (Who's facilitating / New to facilitating?) → `Article` with `SubNav` "Facilitators" + `Heading display` "A Sunday at a glance", lede, `ListRow type="step"` ×6, `Heading 3` "Creating a container" + paragraph, `SectionLabel` "— Documents & links", `ListRow type="document"` ×6, support `PullQuote` with "Contact the CTC →" → `FooterB` | `site.facilitators` only |
| `/facilitators/enter` | `SplitHero` (nav + brand only, no header, no photo) → `PageHeader` "Facilitator hub" beside `PasswordGate` card (Input, `Button filled` "Enter", `ArrowLink` "Not a facilitator yet? Here's how to start →", error line hidden unless `?error`) → `FooterB` | server action `enterFacilitators` |
| `/sangha` (gated, member password) | `SplitHero` "Sangha Hub" → 2 × `InfoColumn` → `Article` with `SubNav` "Sangha Hub" (Overview · Series · Library · Writing · Resources) + `Heading display` "What's going on", lede, then three `SectionLabel` + `List` blocks (series as `type="event"`, shelf and writing as `type="document"`) each closed by an `ArrowLink`, and a clay-ruled block pointing at Resources → `FooterB` | `getSeries(3)`, `getLibrary(4)`, `getMemberPosts(3)` |
| `/sangha/series` (gated) | `TopNav` + `BrandBlock` + `PageHeader` "Event series" → `Article` with the hub `SubNav`; per series a `SectionLabel` (status · dates · cadence), `Heading 3`, description, place, `ListRow type="event"` per session, optional `ArrowLink` "RSVP for the series →" → `FooterB` | `getSeries()` |
| `/sangha/library` (gated) | `TopNav` + `BrandBlock` + `PageHeader` "Sangha library" → `Article` with the hub `SubNav`; per status a `SectionLabel` (On the shelf / Lent out / Wanted) + `ListRow type="document"` (kind = Book/Zine, description = author · note · owner, action = Ask *name* → / Ask to be next → / Offer yours →) → `FooterB` | `getLibraryByStatus()` |
| `/sangha/writing` (gated) | `TopNav` + `BrandBlock` + `PageHeader` "Member writing" → `Article` with the hub `SubNav` + `ListRow type="document"` per post (kind = publication, description = author · month · excerpt, action "Read →", opens the post) → `FooterB` | `getMemberPosts()` |
| `/sangha/resources` (gated) | `TopNav` + `BrandBlock` + `PageHeader` "Resources & recommendations" → `Article` with the hub `SubNav`; per group a `SectionLabel` + `ListRow type="document"` → `FooterB` | `site.sangha.resources` only |
| `/sangha/enter` | As `/facilitators/enter`, with the member copy and the `enterSangha` action | server action `enterSangha` |

Submitting an event is a link to Luma/Partiful plus the `/api/submit-event` route from `SETUP-supabase-vercel.md`; there is no separate submit page in Direction B. If one is added later, it is `PageHeader` + a form built from `Input` and `Button` inside an `Article`.

`app/layout.tsx` sets fonts and `globals.css` only. `TopNav` and `FooterB` are rendered by each page (inside `SplitHero` on pages that have one) so the hero can own the nav's position.

### 5.3 Data access

```ts
// src/lib/data/events.ts — the only place that knows table/column names
export async function getUpcomingEvents(opts: { limit?: number; type?: EventType } = {}): Promise<PublicEvent[]>
export async function getEventsByMonth(type?: EventType): Promise<Array<{ month: string; events: PublicEvent[] }>>
// src/lib/data/leaders.ts   getLeaders(limit?)
// src/lib/data/settings.ts  getSettings()  — merges the site_settings row over site.config fallbacks
// src/lib/data/series.ts    getSeries({ limit?, includeFinished? })  formatSeriesRange(startsAt, endsAt)
// src/lib/data/library.ts   getLibrary({ limit? })  getLibraryByStatus()  describeLibraryItem(item)
// src/lib/data/posts.ts     getMemberPosts({ limit? })  formatPostDate(iso)  describeMemberPost(post)
```

`library_items` and `member_posts` carry members' names and contact links, so they get no public read
policy: they are read server-side with the service-role client, and only ever rendered inside `/sangha`.

Components receive mapped types, never raw rows. `fixtures.ts` provides the same shapes for building pages before Supabase exists.

---

## 6. Responsive behaviour

Three artboards: 390, 834, 1440. Breakpoints `md: 834px`, `xl: 1440px`. Each component implements its own Figma `Breakpoint` variants:

| Component | < 834 | 834–1439 | ≥ 1440 |
|---|---|---|---|
| `TopNav` | icon + wordmark; `MenuSheet` on tap | full links, 40 gutter | full links, 72 gutter |
| `SplitHero` | stacked; photo 390×300 below header | text fill + photo 340 | 720 / 720 |
| `InfoColumn` row | stacked, gap 24 | 2 across | 2–3 across |
| `Article` | `SubNav` as chip row above; column full width | 180 + fill, gap 64 | 220 + 760, gap 96 |
| `ListRow` | lead → title → meta → action stacked, padding 14 | desktop layout | desktop layout |
| `FooterB` | stacked | brand 220 + 3 columns | brand + 3 columns |
| Display / Lede | 36 / 20 | 44 / 22 | 48 / 24 |

`MenuSheet`: `<button aria-expanded>` with lucide `Menu`/`X`; full-screen `surface` panel listing nav then footer columns as `ListRow`-style rows; closes on route change and Escape; focus trapped while open.

`SubNav` sticky/scroll-spy: `IntersectionObserver` on the article headings sets `active`; `position: sticky; top: 96px` within the `Article` grid; on mobile the chip row is `position: sticky; top: 57px` under the nav.

---

## 7. Accessibility and performance

- Contrast pairs and lint rules: `DESIGN-SYSTEM.md` §10.
- Focus ring: global `:focus-visible` in `accent`, 2px, offset 2px.
- `ListRow` with an action wraps the row in one `<a>` whose accessible name is the title.
- `SubNav` is `<nav aria-label={group}>`, active item `aria-current="page"`; filters on `/events` also sync to the URL.
- Forms: real `<label for>`, errors via `aria-describedby`, password field `autocomplete="current-password"`.
- Images: `next/image`, hero `priority sizes="(min-width:834px) 50vw, 100vw"`, figures `sizes="(min-width:1440px) 760px, (min-width:834px) 60vw, 100vw"`.
- Pages `revalidate = 300`; facilitator pages `dynamic = 'force-dynamic'` (cookie).
- Only motion: Arrow Link hover, nav rule fade, menu sheet; all under `motion-safe:`.

---

## 8. Build order

| Step | Do | Checkpoint |
|---|---|---|
| 0. Repo ✅ | Scaffolded Next.js 16 / React 19 / Tailwind v4 at the repo root (2026-09-20). | `npm run dev` runs. |
| 1. Deps & assets ✅ | `class-variance-authority tailwind-merge clsx lucide-react zod` installed (`@supabase/supabase-js` not yet). `lib/cn.ts` extends tailwind-merge with the text-size tokens. `assets/` → `public/images/`, `docs/` → `public/docs/`. | `npm run lint && npm run build` pass. |
| 2. Tokens & type ✅ (gen-tokens script and `/dev/tokens` page TODO) | `tokens.css`, `globals.css`, fonts in `layout.tsx`, lint rules from `DESIGN-SYSTEM.md` §10 in `eslint.config.mjs` (scoped to className/style/cva/cn literals). | `/dev/tokens` (dev-only) renders the nine swatches and ten text styles; compare with Figma side by side. Lint rejects a test file containing `font-medium` and `#7A5233`. |
| 3. Primitives ✅ (kitchen sink TODO) | `Heading`, `Text`, `Container`, `Section`, `Article`, `Input`, `ArrowLink`, `Button`, `SectionLabel`. | `/dev/kitchen-sink` shows each beside its Figma screenshot. |
| 4. Layout components ✅ (visual QA against Figma TODO) | `TopNav` + `MenuSheet`, `BrandBlock` (with the U+2665 wordmark), `FooterB`, wired from `site.config.ts`. | Match Figma at 1440 / 834 / 390. Keyboard-only navigation works. Wordmark heart renders monochrome on macOS, iOS, Android, Windows. |
| 5. Content components ✅ | `PageHeader`, `SplitHero`, `InfoColumn`, `SubNav`, `ListRow` (4 types), `Figure`, `PullQuote`, `PasswordGate`. | Kitchen sink updated; every `ListRow` type shown at desktop and mobile. |
| 6. Pages with fixtures ✅ (Lighthouse/visual QA TODO) | `/`, `/events`, `/facilitators`, `/facilitators/enter` composed from `lib/data/fixtures.ts`. | Each route matches its Figma artboard at three widths. Lighthouse a11y ≥ 95. |
| 7. Data | Supabase per `SETUP-supabase-vercel.md`; implement `lib/data/*`; replace fixtures; `/api/submit-event` with zod. | A pending row published in the dashboard appears on `/events` within 5 minutes. |
| 8. Password gate ✅ | `src/proxy.ts` + `enterFacilitators` server action (`useActionState`); `noindex` on both pages; env in `.env.example`. | Wrong password shows the error state; right password sets the cookie and redirects to `next`. |
| 9. Ship | `keepalive` cron, OG image (uses `tokens.ts`), `robots.txt`, Vercel import. | Preview reviewed by a facilitator on a phone. |

### 8.1 How to change X

**A color.** Edit the hex in `tokens.css`; names match Figma. For a re-skin, change only the semantic alias lines.

**A nav item.** Add `{ label, href }` to `site.nav`. `TopNav`, `MenuSheet` and the active state pick it up.

**Meeting time or contact.** Edit the `site_settings` row in Supabase, or the fallback in `site.meeting` / `site.contact`.

**A new list type.** Add a `type` value to `ListRow`'s cva and a fields interface; add it to the kitchen sink; create the matching variant in the Figma List Row set so the two stay in sync.

**A page.** `app/<route>/page.tsx` composed from `SplitHero` or `PageHeader`, `InfoColumn`s, `Article` + `SubNav`, `ListRow`s, `FooterB`; copy under a new key in `site.config.ts`; link it from `site.nav` or a footer column.

**A text style.** Don't. Nine styles is the rule. If a tenth is unavoidable, add it in Figma first, then as one `--text-*` block in `tokens.css`, and update the lint allow-list.

**The wordmark.** Change `site.wordmark`, keeping `♥︎` for the heart.
