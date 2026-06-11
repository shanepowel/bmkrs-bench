# Agent guide — bmkrs bench

**This repo is the bench app.** Do not implement bench product work in `Freelance-Near-Me/freelancenearme.com` — that repo is the public FNM marketplace (`master`).

- **GitHub:** https://github.com/shanepowel/bmkrs-bench
- **Deploy:** Vercel project linked to this repo (`main`) → app.bmkrs.com / bmkrs-bench-web.vercel.app
- **Local clone:** `/Users/shanepowell/bmkrs-bench` (port **3001**)

## Stack

- **App:** `apps/web` — Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **DB:** `packages/database` — Prisma 7 + `@bench/database` + PostgreSQL (Neon)
- **Auth:** Clerk (bench app) or dev cookie / Supabase OTP — see [docs/AUTH-DROP.md](docs/AUTH-DROP.md)
- **Deploy:** Vercel, root directory `apps/web`

## Docs

- [docs/BENCH.md](docs/BENCH.md) — product spec
- [docs/BENCH-UI-DROP.md](docs/BENCH-UI-DROP.md) — UI integration map
- [docs/AUTH-DROP.md](docs/AUTH-DROP.md) — login and marketing deep links
- [docs/BRAND-KIT.md](docs/BRAND-KIT.md) — design tokens

## Marketing entry routes (www → app)

| URL | Purpose |
|---|---|
| `/login` | Member login (canonical; `/sign-in` redirects here) |
| `/join` | Specialist intake → `/apply` |
| `/hire` | Company landing → www contact or `/login` |

Configure Sanity `siteSettings` to point at `https://app.bmkrs.com/login`, `/join`, `/hire`.

## Commands

```bash
npm install && npm run dev   # http://localhost:3001
npm run build -w web
npm run db:migrate:deploy && npm run db:seed
```
