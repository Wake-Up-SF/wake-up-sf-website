# wake-up-sf-website
The main site for new visitors

## Run locally

```bash
npm install
cp .env.example .env.local   # two password gates, four values (see below)
npm run dev                  # http://localhost:3000
npm run lint && npm run build
```

Two areas are behind shared passwords, each with its own password and cookie:

| Area | Password | Cookie secret |
|---|---|---|
| `/facilitators` — facilitator hub | `FACILITATOR_PASSWORD` | `FACILITATOR_COOKIE_SECRET` |
| `/sangha` — Sangha Hub (series, library, member writing, resources) | `MEMBER_PASSWORD` | `MEMBER_COOKIE_SECRET` |

Without them set, both areas redirect to their password page and nothing can unlock. See
`plans/SETUP-supabase-vercel.md` §6b–6c.

Design system and build plan: `plans/DESIGN-SYSTEM.md`, `plans/PLAN-components.md`, `plans/SETUP-supabase-vercel.md`. Directions for AI sessions: `CLAUDE.md`.
