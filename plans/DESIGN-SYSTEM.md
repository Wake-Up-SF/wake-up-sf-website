# Wake Up SF — Design System (Direction B, "editorial")

Single source of truth for the codebase. Everything in the Next.js + Tailwind build derives from this document and from two Figma pages:

- **"🌿 Direction B · Plum Village"** — the screens (desktop 1440, tablet 834, mobile 390)
- **"🌿 Direction B · Components"** — the component set

Direction A (pages "🎨 Design System" / "🖥 Screens") is an archived exploration. **None of its tokens or components exist in the codebase.**

Companion docs: `PLAN-components.md` (build plan) and `SETUP-supabase-vercel.md` (data, hosting, password gate).

---

## 1. Principles

1. **White is the surface.** Pages are `white`. The only tinted surface is the footer (`bg`, warm cream). No colored bands.
2. **One accent.** `clay` for links, active nav items, and the single filled button. `clay-dark` on hover only.
3. **Rules, not boxes.** Sections and list rows are separated by 1px `rule` lines. Emphasized columns get a 1px `ink` top rule. No cards with fills or radii.
4. **Serif for the voice, sans for the interface.** Titles and ledes are EB Garamond. Everything interactive (nav, links, meta, forms) is Work Sans.
5. **Photos are full-bleed or column-width, never tinted.** Captions are Body 3 `ink-faint` directly beneath.
6. **Generous rhythm.** 88–96px between sections, 72px gutters on desktop, 1296px content width.

---

## 2. Color tokens

These nine Figma variables are the **entire** color palette in code.

| Figma variable | Hex | Role |
|---|---|---|
| `color/white` | `#FFFFFF` | Page surface |
| `color/bg` | `#F8F3EA` | Footer surface |
| `color/bg-alt` | `#F1E8D8` | Placeholder avatars, subtle fills |
| `color/ink` | `#2B2A25` | Primary text, emphasis top rules |
| `color/ink-soft` | `#4A4842` | Secondary text (paragraphs) |
| `color/ink-faint` | `#7A776C` | Meta, captions, section labels, lead columns |
| `color/clay` | `#7A5233` | Links, active nav, filled button, quote rule |
| `color/clay-dark` | `#55381F` | Hover state of the above, only |
| `color/rule` | `#E7DFCF` | 1px rules, input borders, outline button border |

**Not in the codebase:** `sage`, `sage-dark`, `sage-light`, `sand`, `sand-text`, `dust-blue`, `footer-bg`. They remain in the Figma collection for Direction A only. Any occurrence in code is a lint error (§10).

Semantic aliases (components use these; palette names are never used directly in components):

| Alias | Points to |
|---|---|
| `surface` | white |
| `surface-footer` | bg |
| `surface-muted` | bg-alt |
| `text` | ink |
| `text-muted` | ink-soft |
| `text-faint` | ink-faint |
| `accent` | clay |
| `accent-hover` | clay-dark |
| `rule` | rule |
| `on-accent` | white |

---

## 3. Typography

Two families. **Exactly ten text styles**, each at one fixed weight. There are no weight or italic variants: nothing in the design or the code uses `font-medium`, `font-semibold`, or `italic`. Weight comes from the style token only: links use Heading 4 (SemiBold 16) in `accent`, never `font-semibold` on another style.

| Figma style | Font | Size / line-height / tracking | Utility | Use |
|---|---|---|---|---|
| Heading 1 | Work Sans SemiBold | 56 / 110% / −3px | `text-h1` | Unused in Direction B; kept in the scale |
| Heading 2 | Work Sans SemiBold | 34 / 120% / −1px | `text-h2` | List-section headings ("Upcoming events") |
| Heading 3 | Work Sans SemiBold | 22 / 130% / −0.5px | `text-h3` | Info Column titles, Event row titles, Get-involved subheads |
| Heading 4 | Work Sans SemiBold | 16 / auto (1.3 in code) / −0.5px | `text-h4` | The link/action style: Arrow Link, List Row actions ("RSVP →", "Open →"), Person contact — always `accent`. Also the Sub Nav group label in `text` |
| Heading 5 | Work Sans SemiBold | 14 / 21px / −0.5px | `text-h5` | The active Sub Nav item, in `accent`. Inactive items stay Body 3 |
| Body 1 | Work Sans Regular | 18 / 130% / −0.5px | `text-body-1` | Person / Document / Step row titles, Pull Quote text |
| Body 2 | Work Sans Regular | 16 / 160% / −0.5px | `text-body-2` | Paragraphs, list-row lead column |
| Body 3 | Work Sans Regular | 14 / 150% / −0.5px | `text-body-3` | Nav, sub-nav, section labels, meta, captions, footer |
| Display · Serif | EB Garamond SemiBold | 48 / 110% / −3px | `text-display` | Page and article titles |
| Lede · Serif | EB Garamond Regular | 24 / 150% / −0.5px | `text-lede` | Paragraph directly under a Display title |

**Responsive sizes.** Figma has no per-breakpoint text styles, so the tablet/mobile artboards carry size overrides on the serif styles. In code this is a deliberate, documented exception: `text-display` and `text-lede` are responsive utilities (see §5), and these are the only size changes anywhere.

| Style | Desktop ≥1440 | Tablet 834 | Mobile 390 |
|---|---|---|---|
| Display · Serif | 48 | 44 | 36 |
| Lede · Serif | 24 | 22 | 20 |

Everything else keeps its size at every width.

**Rules:** no `font-*` weight utilities, no `italic`, no `uppercase`, no positive letter-spacing (`tracking-wide` etc.), no font sizes outside the ten tokens (`text-xl`, `text-[15px]`).

**Fonts** (`next/font/google`, self-hosted at build):

```ts
// src/app/layout.tsx
import { Work_Sans, EB_Garamond } from 'next/font/google'

const workSans = Work_Sans({
  subsets: ['latin'], weight: ['400', '600'], style: ['normal'],   // Regular for Body, SemiBold for Headings; nothing else
  variable: '--font-work-sans', display: 'swap',
})
const ebGaramond = EB_Garamond({
  subsets: ['latin'], weight: ['400', '600'], style: ['normal'],
  variable: '--font-eb-garamond', display: 'swap',
})
// <html className={`${workSans.variable} ${ebGaramond.variable}`}>
```

---

## 4. Spacing, sizing, radii

| Measure | Desktop 1440 | Tablet 834 | Mobile 390 |
|---|---|---|---|
| Gutter | 72 | 40 | 20 |
| Content width | 1296 | 754 | 350 |
| Section vertical padding | 88–96 | 72 | 48–56 |
| Sub Nav width | 220 | 180 | full width (chip row) |
| Sub Nav → article gap | 96 | 64 | — |
| Article width | 760 | fill | fill |
| Info Column gap (2–3 across) | 48 | 48 | stacked, 24 |
| List Row lead column | 130–180 | 130 | above title |
| List Row vertical padding | 18–22 | 18–22 | 14 |
| Split Hero photo | 720 × full height | 340 × full height | 390 × 300 |

Gaps in use (the only allowed numeric spacing values): `2 4 6 8 10 12 14 16 20 24 28 32 40 48 64 96`.

Radii: `4px` on buttons and inputs. `999px` only on the legacy Input Field (password gate). No card radii, no pills elsewhere.

Rules: 1px `rule` for separators and borders, 1px `ink` for emphasized top rules, 3px `clay` left rule on Pull Quote.

---

## 5. Tailwind v4 `@theme`

`src/styles/tokens.css` is the whole token layer. It emits real CSS custom properties; nothing else in the repo contains a hex value.

```css
/* src/styles/tokens.css — mirrors Figma collection "Wake Up SF" (Direction B subset) */
@theme {
  /* ---- Palette (Figma color/*) ---- */
  --color-white:      #FFFFFF;
  --color-bg:         #F8F3EA;
  --color-bg-alt:     #F1E8D8;
  --color-ink:        #2B2A25;
  --color-ink-soft:   #4A4842;
  --color-ink-faint:  #7A776C;
  --color-clay:       #7A5233;
  --color-clay-dark:  #55381F;
  --color-rule:       #E7DFCF;

  /* ---- Semantic aliases (components use only these) ---- */
  --color-surface:        var(--color-white);
  --color-surface-footer: var(--color-bg);
  --color-surface-muted:  var(--color-bg-alt);
  --color-text:           var(--color-ink);
  --color-text-muted:     var(--color-ink-soft);
  --color-text-faint:     var(--color-ink-faint);
  --color-accent:         var(--color-clay);
  --color-accent-hover:   var(--color-clay-dark);
  --color-on-accent:      var(--color-white);
  /* --color-rule is both palette and alias */

  /* ---- Fonts ---- */
  --font-sans:  var(--font-work-sans), system-ui, sans-serif;
  --font-serif: var(--font-eb-garamond), Georgia, serif;

  /* ---- Type scale (size / line-height / tracking / weight) ---- */
  --text-h1: 56px;      --text-h1--line-height: 1.1;  --text-h1--letter-spacing: -3px;    --text-h1--font-weight: 600;
  --text-h2: 34px;      --text-h2--line-height: 1.2;  --text-h2--letter-spacing: -1px;    --text-h2--font-weight: 600;
  --text-h3: 22px;      --text-h3--line-height: 1.3;  --text-h3--letter-spacing: -0.5px;  --text-h3--font-weight: 600;
  --text-h4: 1rem;      --text-h4--line-height: 1.3;  --text-h4--letter-spacing: -0.03125em;
  --text-h5: 0.875rem;
  --text-h5--line-height: 1.5;
  --text-h5--letter-spacing: -0.0357em;
  --text-h4--font-weight: 600; /* links & actions */
  --text-h5--font-weight: 600; /* active sub-nav item */
  --text-body-1: 18px;  --text-body-1--line-height: 1.3; --text-body-1--letter-spacing: -0.5px; --text-body-1--font-weight: 400;
  --text-body-2: 16px;  --text-body-2--line-height: 1.6; --text-body-2--letter-spacing: -0.5px; --text-body-2--font-weight: 400;
  --text-body-3: 14px;  --text-body-3--line-height: 1.5; --text-body-3--letter-spacing: -0.5px; --text-body-3--font-weight: 400;
  /* Serif (apply with font-serif). -md/-sm are the tablet/mobile sizes: class="text-display-sm md:text-display-md xl:text-display" */
  --text-display: 48px;    --text-display--line-height: 1.1; --text-display--letter-spacing: -3px;   --text-display--font-weight: 600;
  --text-display-md: 44px; --text-display-md--line-height: 1.1; --text-display-md--letter-spacing: -3px; --text-display-md--font-weight: 600;
  --text-display-sm: 36px; --text-display-sm--line-height: 1.1; --text-display-sm--letter-spacing: -2px; --text-display-sm--font-weight: 600;
  --text-lede: 24px;       --text-lede--line-height: 1.5; --text-lede--letter-spacing: -0.5px; --text-lede--font-weight: 400;
  --text-lede-md: 22px;    --text-lede-md--line-height: 1.5; --text-lede-md--letter-spacing: -0.5px; --text-lede-md--font-weight: 400;
  --text-lede-sm: 20px;    --text-lede-sm--line-height: 1.5; --text-lede-sm--letter-spacing: -0.5px; --text-lede-sm--font-weight: 400;

  /* ---- Spacing: base unit 1px so gap-24 = 24px, matching Figma values ---- */
  --spacing: 1px;
  --spacing-gutter: 72px;
  --spacing-gutter-md: 40px;
  --spacing-gutter-sm: 20px;
  --spacing-section: 96px;
  --spacing-section-md: 72px;
  --spacing-section-sm: 56px;
  --spacing-content: 1296px;
  --spacing-subnav: 220px;
  --spacing-subnav-md: 180px;
  --spacing-article: 760px;

  /* ---- Radii ---- */
  --radius-sm: 4px;      /* buttons, inputs */
  --radius-pill: 999px;  /* legacy Input Field only */

  /* ---- Breakpoints (match the three Figma artboards) ---- */
  --breakpoint-md: 834px;
  --breakpoint-xl: 1440px;
}
```

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import '../styles/tokens.css';

@layer base {
  html { font-family: var(--font-sans); color: var(--color-text); background: var(--color-surface); }
  body { @apply text-body-2 antialiased; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  ::selection { background: var(--color-bg-alt); }
}
```

```ts
// src/styles/tokens.ts — GENERATED by scripts/gen-tokens.ts from tokens.css; do not edit
export const colors = {
  white: '#FFFFFF', bg: '#F8F3EA', bgAlt: '#F1E8D8',
  ink: '#2B2A25', inkSoft: '#4A4842', inkFaint: '#7A776C',
  clay: '#7A5233', clayDark: '#55381F', rule: '#E7DFCF',
} as const
export const type = {
  h1: [56, 1.1, -3, 600], h2: [34, 1.2, -1, 600], h3: [22, 1.3, -0.5, 600], h4: [16, 1.3, -0.5, 600],
  body1: [18, 1.3, -0.5, 400], body2: [16, 1.6, -0.5, 400], body3: [14, 1.5, -0.5, 400],
  display: [48, 1.1, -3, 600], lede: [24, 1.5, -0.5, 400],
} as const // [px, lineHeight, letterSpacingPx, weight]
export const space = [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 64, 96] as const
export const radius = { sm: 4, pill: 999 } as const
export const breakpoints = { md: 834, xl: 1440 } as const
```

`tokens.ts` is only for places CSS cannot reach (OG images, email). Generated in `prebuild`.

---

## 6. Components

All from Figma page **"🌿 Direction B · Components"**. One Figma component → one file in `src/components/editorial/`. Figma `Breakpoint` variants are **responsive class variants in code, not separate components**; the Figma variants document the target layout at each width.

| Figma component | React | Figma props → React props | Breakpoints | Notes |
|---|---|---|---|---|
| **Top Nav** | `TopNav` | `items: NavItem[]`, `active: string` | Desktop / Tablet / Mobile | Menu icon + Body 3 links, 28 gap, 18px vertical padding, gutters 72/40/20. Active item `accent`. Mobile: links collapse into the menu icon + wordmark. Sticky (§8). |
| **Arrow Link** | `ArrowLink` | `Label` → `label`; `href` | — | Heading 4 `accent`, trailing `→`. The only in-copy action. |
| **Button** | `Button` | `Variant=Filled\|Outline` → `variant: 'filled' \| 'outline'`; `Label` → `label`/children | — | 4px radius, 8×16 padding, Body 3. Filled: `accent`/`on-accent`. Outline: 1px `ink` at 30%. Top nav and forms only. |
| **Section Label** | `SectionLabel` | `Label` → `label` | — | "— September" style, Body 3 `text-faint`, above a list or footer column. |
| **Info Column** | `InfoColumn` | `Title` → `title`; `Body` → `body`; nested Arrow Link → `link?: {label, href}` | — | 1px `ink` top rule, 16px top padding, Heading 3 title, Body 2 body. 2–3 across, 48 gap. |
| **Sub Nav** (group Heading 4, active item Heading 5, items Body 3) | `SubNav` | `Group` → `group`; `Item 1–6` + `Show item 4–6` → `items: {label, href}[]` (max 6); active via fill override → `active` | Desktop / Tablet / Mobile | 220 / 180 column; Mobile = wrapping horizontal chip row. Group label Heading 4 `text`, items Body 3 `text-muted`, active item Heading 5 `accent`. Sticky (§8). |
| **Brand Block** | `BrandBlock` | `Wordmark` → `wordmark` (default `san francisco ♥`) | Desktop / Tablet / Mobile | Logo 238×124 / 169×88 / 200×105 (stacked on mobile), padding 56/72 → 24/40 → 24/20. See §7 for the heart glyph. |
| **Page Header** | `PageHeader` | `Title` → `title`; `Lede` → `lede`; `Show links`, `Show link 2` + two nested Arrow Links → `links?: {label, href}[]` (0–2) | Desktop / Tablet / Mobile | Display · Serif + Lede · Serif, sizes 48/24 → 44/22 → 36/20. |
| **Split Hero** | `SplitHero` | composed: `nav`, `wordmark`, `title`, `lede`, `links`, `image?: {src, alt}` | Desktop / Tablet / Mobile | Left: Top Nav + Brand Block + Page Header. Right: photo 720 full-height / 340 / 390×300 stacked below. Without `image` it renders the left column at full width (Events). |
| **List Row** | `ListRow` | `Type=Event\|Person\|Document\|Step\|Book` → `type`; `Breakpoint=Desktop\|Mobile`; props `Lead, Title, Meta, Action` (Event), `Name, Role, Contact` (Person), `Kind, Title, Description, Action` (Document), `Duration, Title, Description` (Step), `Title, Meta, Cover, Action` (Book) | Desktop / Mobile | 1px `rule` above and below, 18–22 vertical padding, 32–40 gap. Lead column Body 2 `text-faint` 130–180px. Event title Heading 3; Person/Document/Step title Body 1; Action and Person Contact are Heading 4 `accent`. Person has a 44px `surface-muted` avatar. **Book** (added for the Sangha library, mirror in Figma) is Person's shape at book proportions: a 64×96 `surface-muted` spine holding the cover, Body 1 title, Body 3 `text-faint` meta, Heading 4 action. A cover that fails to load leaves the blank spine (`ui/CoverImage`), never a broken-image icon. Mobile stacks lead → title → meta → action. |
| **Figure** | `Figure` | nested image + caption → `src`, `alt`, `caption` | — | Column-width photo, 10 gap, Body 3 `text-faint` caption. |
| **Pull Quote** | `PullQuote` | `Quote` → `quote`; `Attribution` → `attribution` | — | 3px `accent` left rule, 28px left padding, Body 1 quote text, Body 3 attribution. |
| **Footer B** | `FooterB` | columns from `site.config.ts` | Desktop / Tablet / Mobile | `surface-footer`. Logo + Body 3 description, three "— Label" columns (Section Label + Body 3 links), bottom row with 1px rule above. Tablet: 220 brand, tighter gaps. Mobile: stacked. |
| **Password Gate** (screen) | `PasswordGate` page | `action`, `copy: GateCopy`, `fallback`, `next?`, `error?` | Desktop / Tablet / Mobile; default + error states | Split Hero (nav + brand only) → Page Header beside a `surface-footer` gate card (Input, Filled Button, Arrow Link, error line hidden by default). Mobile stacks header above card. **Changed in code (Sangha Hub):** the card is no longer bound to the facilitator gate — the page passes the area's server action and its copy, so one card serves both `/facilitators/enter` and `/sangha/enter`. No visual change; nothing to mirror in Figma. |

Component rules:

- Components own no color decisions beyond the semantic aliases; pages only compose.
- `ListRow` is the single list primitive. Events, people, documents, schedule steps and books are all `ListRow` with a `type` prop. In the Sangha Hub, series and their sessions are `type="event"`; member posts and resources are `type="document"` (the `kind` lead column carries the publication or the resource kind); the library shelf is `type="book"`, the one variant the hub added — **mirror it in Figma**.
- No outer margins on components; parents use `gap`.
- Direction A's `SiteHeader`, `SiteFooter`, cards, pills, and wave hero **do not exist** in the codebase.

---

### 6a. Gated areas

Two members-only areas share one gate mechanism (`src/lib/gate.ts`, enforced in `src/proxy.ts`): the
**Facilitator hub** (`/facilitators`, facilitator password) and the **Sangha Hub** (`/sangha`, member
password). They are separate passwords and separate cookies — a member password never opens the
facilitator hub. Hub pages compose the same components as the public pages; the only difference is the
`SubNav` group ("Sangha Hub": Overview · Series · Library · Writing · Resources) and `robots: noindex`,
set once in `src/app/sangha/layout.tsx`.

Book covers come from `src/lib/data/covers.ts`: a file a facilitator uploaded to the Supabase `media`
bucket if there is one, otherwise Open Library's cover for the ISBN (free, no key, allowed in
`next.config.ts`). Covers are decoration — the shelf reads fine as blank spines.

---

## 7. Brand wordmark: "san francisco ♥"

The Brand Block wordmark is the string **`san francisco ♥`** where the heart is the plain text glyph **U+2665 BLACK HEART SUIT (♥)**, never the color emoji ❤️ (U+2764 U+FE0F). It must render as a monochrome glyph in the surrounding text color (`accent`), Heading 4 in code (the 22px in the Figma hero is a size override).

Implement with the text presentation selector so no platform substitutes an emoji:

```tsx
// src/components/editorial/BrandBlock.tsx
export const WORDMARK = 'san francisco ♥︎' // U+2665 + U+FE0E (text presentation)

export function BrandBlock({ wordmark = WORDMARK }: { wordmark?: string }) {
  return (
    <div className="flex items-end justify-between gap-16 px-gutter pt-56">
      <Logo className="h-[124px] w-auto" />
      <span className="text-h4 text-accent [font-variant-emoji:text]">{wordmark}</span>
    </div>
  )
}
```

Belt and braces: `font-variant-emoji: text` on the span, and the literal in `site.config.ts` must be written with the escape `♥︎`, not pasted from Figma (the Figma text currently uses the emoji as a placeholder).

---

## 8. Interaction notes (annotated in Figma Dev Mode)

- **Top Nav**: `position: sticky; top: 0; z-index: 50`, `surface` background. A 1px `rule` bottom border fades in once the page has scrolled ≥ 1px. The menu icon opens a full-screen sheet listing all nav and footer links.
  In code it is always a direct child of the page `<main>` — inside `SplitHero` it sits **above** the split row, not in the left column, because a sticky element can only travel inside its own parent (nested, it unpinned as soon as the hero scrolled past). Consequence on tablet/desktop: the hero row is `100svh − 57px`, so the hero photo starts below the nav bar rather than flush with the top of the viewport.
- **Sub Nav**: `position: sticky; top: 96px` (just under the top nav) for the height of its section, then releases. Active item follows scroll (scroll-spy on the article headings); clicking smooth-scrolls to the heading. On mobile it becomes a horizontal chip row pinned under the top nav at `top: 57px` (the nav height): full content width, `surface` background and a 1px `rule` below it, so the article passes cleanly underneath. The sticky wrapper is `self-stretch` on mobile and `self-start` from `md` up.
- **Arrow Link**: hover underlines the label and shifts the arrow 2px right (`motion-safe:transition`).
- **List Row**: the whole row is the link when it has an action; hover tints the title `accent`.
- **Button**: hover `accent-hover` (filled) / 1px `ink` at 60% (outline). Focus ring per `globals.css`.

---

## 9. Responsive

| | Mobile 390 | Tablet 834 | Desktop 1440 |
|---|---|---|---|
| Gutter | 20 | 40 | 72 |
| Top Nav | icon + wordmark | full links, 40 gutter | full links |
| Split Hero | stacked: nav, brand (logo 200), header (36/20), photo 390×300 | side by side, photo 340 | 720 / 720 |
| Info Columns | stacked, 24 gap | 2 across | 2–3 across |
| Sub Nav + Article | chip row above full-width article | 180 + fill, 64 gap | 220 + 760, 96 gap |
| List Row | stacked (lead, title, meta, action), 14 padding | as desktop | as desktop |
| Footer B | stacked columns | brand 220 + 3 columns | brand + 3 columns |
| Display / Lede | 36 / 20 | 44 / 22 | 48 / 24 |

Breakpoints: `md` = 834px (tablet and up), `xl` = 1440px. Grid and stacking classes live inside the components; page files carry no breakpoint prefixes.

---

## 10. Accessibility, lint, assets

**Contrast (WCAG AA, body text ≥ 4.5):**

| Background | Text | Ratio | Verdict |
|---|---|---|---|
| white | ink | 15.0 | ✓ |
| white | ink-soft | 9.3 | ✓ |
| white | ink-faint | 4.9 | ✓ at 14px+; prefer ink-soft for long copy |
| white | clay | 7.5 | ✓ links |
| bg | ink | 13.7 | ✓ footer |
| bg | ink-soft | 8.5 | ✓ |
| bg | ink-faint | 4.5 | borderline — footer section labels only |
| bg | clay | 6.9 | ✓ |
| clay | white | 7.5 | ✓ filled button |
| bg-alt | ink-faint | 4.1 | ✗ never for text |

Other rules: focus ring `accent` 2px offset 2px, never `outline-none` without a replacement; decorative images `alt=""`; Sub Nav is a `<nav aria-label>` with `aria-current="page"` on the active item; forms use real `<label for>` and `aria-describedby` for errors; photos via `next/image` (`priority` on the hero, `sizes="(min-width:834px) 50vw, 100vw"`); `prefers-reduced-motion` respected via `motion-safe:`.

**Lint (ESLint `no-restricted-syntax` in `src/**`):**

| Forbidden | Message |
|---|---|
| Hex, `rgb(`, `hsl(` literals | Use a color token |
| Palette class names (`bg-clay`, `text-ink`) inside `components/` | Use semantic aliases (`bg-accent`, `text-text`) |
| `sage`, `sand`, `dust`, `footer-bg` anywhere | Direction A token; not in this system |
| `font-thin|light|normal|medium|semibold|bold|black`, `italic` | Nine styles only; weight comes from the style token (`text-h4` for links) |
| `uppercase`, `tracking-wide`, `tracking-wider`, `tracking-widest` | No caps or wide tracking |
| `text-xs|sm|base|lg|xl|Nxl|[` | Use `text-h1..h4`, `text-body-*`, `text-display*`, `text-lede*` only |
| `rounded-(md|lg|xl|2xl|full)` outside Input | Only `rounded-sm` (4px) |
| `m|mx|my|mt|mb-N` in `components/` | Components set no outer margins |

**Assets** (`assets/` at repo root → `public/images/`):

| File | Use |
|---|---|
| `logo.png` | Wake Up wordmark (dark) — Brand Block, Footer B |
| `logo-white.png` | Not used in Direction B; keep for print |
| `hero-weekly-meditation.jpg` | Home Figure |
| `photo-walking.jpg` | Events hero (when a photo is used) |
| `photo-oi.jpg`, `photo-interbeing.jpg` | Spare |
| `photo-pv-countryside.jpg`, `photo-pv-talk.jpg` | **Placeholders** from plumvillage.org (Home and hub heroes). Replace before launch. |

Documents (`docs/` → `public/docs/`): `facilitator-guide-2022.docx`, `charter-2020.pdf`.
