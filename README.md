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

| | FNM marketplace | **bench (this repo)** |
|---|---|---|
| repo | [Freelance-Near-Me/freelancenearme.com](https://github.com/Freelance-Near-Me/freelancenearme.com) | **[shanepowel/bmkrs-bench](https://github.com/shanepowel/bmkrs-bench)** |
| database | neon (fnm) | **separate** neon / postgres |
| auth | clerk (fnm) | **separate** clerk application |
| deploy | freelancenearme.com | **app.bmkrs.com** (Vercel: `main` on this repo) |

rotate every key. never share a database with the public marketplace.

## marketing entry routes (www → app)

| route | journey |
|---|---|
| `/login` | member sign-in → `/home` |
| `/join` | redirects to `/apply` → sign-up → `/application` |
| `/hire` | hirer landing — vetting mechanics + enquiry form → `/api/hire` |

Set `APP_URL` (or `NEXT_PUBLIC_APP_URL`) in production so the home page server fetch to `/api/bench-public` resolves on Vercel.

See [docs/AUTH-DROP.md](docs/AUTH-DROP.md) and [AGENTS.md](AGENTS.md).

## phase 1 (shipped)

- [x] fork + package rename (`@bench/database`)
- [x] brand kit applied (surfaces, logos, ink login)
- [x] middleware: no public marketplace (auth required except `/`, `/apply`, sign-in/up)
- [x] schema: partner status, status events, projects, engagements, brief visibility
- [x] four role shells: applicant, partner, client, studio
- [x] marketplace routes retained for phase 3 (studio-gated or legacy links)

## phase 2 (shipped)

- [x] application form: disciplines, bio, rate band, references, portfolio links
- [x] application checklist + `applicationReadyAt` on submit
- [x] studio pipeline queue with applied/reviewed filters
- [x] applicant detail: audit trail, private studio notes, promote actions
- [x] status promotions write to `PartnerStatusEvent`; trusted promotes applicant → partner

## not deleted (retired in ui only for v1)

payments/escrow, public seo, star reviews — tables and code remain; studio/partner ui de-emphasised until removed in a later pass.
