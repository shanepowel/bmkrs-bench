# bench ui drop

integrated from the bench-app code drop. single source: `apps/web/src/lib/bench-ui.tsx`.

see also: [AUTH-DROP.md](./AUTH-DROP.md) for dev sign-in and `/home`.

## what's wired

| drop file | bench location | notes |
|---|---|---|
| `bench-ui.tsx` | `src/lib/bench-ui.tsx` | tokens, Status dot, NavRail, StageStrip, forms, buttons |
| `page.tsx` | `src/app/page.tsx` | public home; signed-in redirect to `/home` (dev) or role home (clerk) |
| `apply/page.tsx` | `src/app/apply/page.tsx` | intake form → sign-up applicant; draft in sessionStorage |
| `login/page.tsx` | `src/app/login/page.tsx` | ink magic-link ui; dev mode signs in instantly via `/api/login` |
| `bench/page.tsx` | `src/app/studio/bench/page.tsx` | studio bench table with live prisma data |
| `home/page.tsx` | `src/app/home/page.tsx` | role-aware dashboard with live briefs, projects, availability |
| `api/login`, `api/logout` | `src/app/api/login`, `src/app/api/logout` | dev cookie auth; supabase otp when `AUTH_MODE=supabase` |
| `api/apply` stub | not used | clerk + prisma handle applications |

## chrome

marketing pages (`/`, `/apply`, `/login`) render without the top nav header. authenticated areas use `BenchChrome` (site header) via per-section layouts. nav-rail views (`/home`, `/studio/bench`, `/threads`, role homes) are full-bleed paper canvas layouts.

## nav rail — done

shared shell: `BenchAppShell` + `lib/nav-rail.ts` + `lib/nav-for-user.ts`.

| view | route |
|---|---|
| role dashboard | `/home` |
| studio home | `/studio` |
| pipeline queue + applicant | `/studio/pipeline`, `/studio/pipeline/[id]` |
| brief composer | `/studio/briefs` |
| bench search | `/studio/bench` |
| partner home | `/partner` |
| bench profile | `/profile` |
| public partner profile | `/partners/[username]` |
| client your-team | `/client` |
| project threads | `/threads` |

## phase 3–5 — done (v1)

| feature | implementation |
|---|---|
| brief responses | `actions/briefs.ts` + `BriefResponseForm` on `/partner` and `/home` |
| studio brief composer | `/studio/briefs` + `BriefComposerForm` with trusted partner picker |
| studio briefs list | invited jobs from prisma |
| client your-team | `/client` loads active contract talent with `TeamPortrait` |
| threads ui | `/threads` + `BenchMessagePanel`; `/inbox` redirects |
| live dashboards | `actions/dashboard.ts` powers `/home` partner + client sections |
| bench profile | `/profile` — headline, bio, rate band, skills, availability, portfolio |
| public partner profile | `/partners/[username]` with track record + portfolio |
| track records | `actions/track-record.ts` on profile + public partner page |
| illustrated portraits | `TeamPortrait` svg avatars |
| supabase auth mode | `@supabase/ssr` + `lib/supabase-auth.ts` — otp + callback |
| payments ui retired | `/settings/payouts` and `/settings/transactions` show off-platform copy |

## dev testing

```bash
npm run dev          # http://localhost:3001
npm run db:seed      # seed users + briefs + track record demo data
```

sign in at `/login` with `partner@demo.bmkrs.com` (any email containing nothing special → partner seed user). edit profile at `/profile`, view public page at `/partners/sarah_dev`.
