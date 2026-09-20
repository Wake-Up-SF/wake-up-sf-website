# Wake Up SF website — directions for Claude

Repo: https://github.com/Wake-Up-SF/wake-up-sf-website (this folder is the checkout of `main`).
Figma: https://www.figma.com/design/VQ4hadDgL9lSzsdiX0Mk0B — build only from pages **"🌿 Direction B · Plum Village"** (screens: desktop 1440, tablet 834, mobile 390) and **"🌿 Direction B · Components"**. The Direction A pages ("🎨 Design System", "🖥 Screens") are archived and must not be used.

## Read first
- `plans/DESIGN-SYSTEM.md` — the single source of truth for tokens, type, components, interactions, responsive rules, lint rules.
- `plans/PLAN-components.md` — build plan, folder structure, page recipes, build order.
- `plans/SETUP-supabase-vercel.md` — data model, hosting, password gate.

## Hard rules
1. **Tokens only.** Nine colors (`white, bg, bg-alt, ink, ink-soft, ink-faint, clay, clay-dark, rule`) via Tailwind theme classes. No hex literals in components. No sage/sand/dust-blue/footer-bg.
2. **Ten text styles, nothing else.** Heading 1–5, Body 1–3, Display · Serif, Lede · Serif. Weight lives in the style (Heading 4/5 are SemiBold); never add `font-*`, `italic`, `uppercase`, or `tracking-*` utilities, never an off-scale `text-` size. Links and actions are Heading 4 in clay; the active sub-nav item is Heading 5.
3. **Components, not one-offs.** Everything on a page is composed from the Direction B component set (Top Nav, Brand Block, Page Header, Split Hero, Sub Nav, Info Column, List Row, Figure, Pull Quote, Arrow Link, Button, Section Label, Footer B, Password Gate). Components with a `Breakpoint` variant in Figma get responsive classes, not separate components.
4. **Wordmark:** `san francisco ♥` renders the heart as the text glyph U+2665 + U+FE0E, never the color emoji.
5. **White surfaces, one accent, 1px rules.** No tinted bands, no cards with fills/radii, no scrims, no wave.
6. **Content stays editable in one place:** static copy, nav, footer links, meeting info in `src/config/site.ts`; events/leaders from Supabase; the facilitator schedule is a link to the Google Sheet, never imported.
7. **Facilitators area** is behind the shared-password middleware; the sub-pages are `noindex`.
8. Keep Figma and code in sync: if a component changes in code, note it in `plans/DESIGN-SYSTEM.md` and mirror it in the Figma component; don't add Figma text styles or variables without asking.

## Working in Figma (use_figma)
- Load `figma:figma-use` before writing. One `setCurrentPageAsync` per call. Never `resize()` an auto-layout frame without restoring its sizing mode. Never set FILL/HUG on absolute-positioned nodes. Check text style links by resolving `textStyleId` against `getLocalTextStylesAsync()`; a non-empty id can be dangling.
- Instance overrides beat main-component changes: after changing a component's text style, clear overrides on the instances.

## Placeholders to replace before launch
Facilitator names other than Charisse Yeh, the phone (415) 555-0100, hello@wakeupsf.org, Plum Village photos in `assets/` (`photo-pv-*`), the facilitator password, Luma/Partiful links.
