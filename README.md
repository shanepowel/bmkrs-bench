# bmkrs bench

the bmkrs trusted partner portal. the studio's vetted bench of collaborators: partners assigned to client projects, clients meeting the team through it.

**product:** the bench · **agency:** bmkrs · **target:** `bench.bmkrs.com`

forked from the freelance near me marketplace codebase. same auth (clerk), same core mechanics (profiles, applications, skills, threads, contracts). different trust model and visibility.

## docs

- [docs/BRAND-KIT.md](docs/BRAND-KIT.md) — design tokens and voice
- [docs/BENCH.md](docs/BENCH.md) — product spec and phase plan

## setup

```bash
npm install
cp apps/web/.env.example apps/web/.env
# set DATABASE_URL, Clerk keys (new project — do not reuse FNM keys)
npm run db:migrate:deploy
npm run db:seed
npm run dev   # http://localhost:3001
```

## infrastructure

| | FNM | bench |
|---|---|---|
| repo | freelancenearme | **bmkrs-bench** (create on github) |
| database | neon (fnm) | **new** neon or postgres |
| auth | clerk (fnm) | **new** clerk application |
| deploy | freelancenearme.com | bench.bmkrs.com |

rotate every key. never share a database with the public marketplace.

## phase 1 (shipped in this fork)

- [x] fork + package rename (`@bench/database`)
- [x] brand kit applied (surfaces, logos, ink login)
- [x] middleware: no public marketplace (auth required except `/`, `/apply`, sign-in/up)
- [x] schema: partner status, status events, projects, engagements, brief visibility
- [x] four role shells: applicant, partner, client, studio
- [x] marketplace routes retained for phase 2–3 (studio-gated or legacy links)

## not deleted (retired in ui only for v1)

payments/escrow, public seo, star reviews — tables and code remain; studio/partner ui de-emphasised until removed in a later pass.
