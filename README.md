# wake-up-sf-website
The main site for new visitors

## Run locally

```bash
npm install
cp .env.example .env.local   # set FACILITATOR_PASSWORD and FACILITATOR_COOKIE_SECRET
npm run dev                  # http://localhost:3000
npm run lint && npm run build
```

Design system and build plan: `plans/DESIGN-SYSTEM.md`, `plans/PLAN-components.md`, `plans/SETUP-supabase-vercel.md`. Directions for AI sessions: `CLAUDE.md`.
