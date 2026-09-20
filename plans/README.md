# plans/

Planning documents for the Wake Up SF website (https://github.com/Wake-Up-SF/wake-up-sf-website). The site is built against the **Direction B ("editorial")** design system only.

| File | What it is |
|---|---|
| `DESIGN-SYSTEM.md` | Single source of truth: the nine color tokens, nine text styles, spacing and radii, the Tailwind `@theme` block, the component inventory (Figma → React), the "san francisco ♥" wordmark rule, interaction and responsive notes, lint rules. |
| `PLAN-components.md` | Front-end build plan: stack decisions, folder structure, component files and props, `site.config.ts`, page recipes for Home / Events / Facilitator hub / Password gate, data layer, build order with checkpoints, how-to-change-X. |
| `SETUP-supabase-vercel.md` | Data and hosting: Supabase schema and RLS, storage, Vercel deploy, submission notifications, the shared-password gate, free-tier gotchas, handoff checklist. |

Figma: https://www.figma.com/design/VQ4hadDgL9lSzsdiX0Mk0B — pages "🌿 Direction B · Plum Village" (screens) and "🌿 Direction B · Components".

Assets are at the repo root: `assets/` (logo, photos) and `docs/` (facilitator guide, charter).
