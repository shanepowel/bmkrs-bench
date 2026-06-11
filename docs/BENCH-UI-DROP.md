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
| `home/page.tsx` | `src/app/home/page.tsx` | role-aware dashboard (partner briefs/projects, client projects, studio jump-off) |
| `api/login`, `api/logout` | `src/app/api/login`, `src/app/api/logout` | dev cookie auth; supabase scaffold when `AUTH_MODE=supabase` |
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
| client your-team | `/client` |
| project threads | `/threads` |

## phase 3–4 features — done (v1)

| feature | implementation |
|---|---|
| brief responses | `actions/briefs.ts` + `BriefResponseForm` on `/partner` (i'm in / not this time / when) |
| studio briefs list | `/studio/briefs` reads invited jobs from prisma |
| client your-team | `/client` loads active contract talent with `TeamPortrait` initials |
| threads ui | `/threads` + `BenchMessagePanel`; `/inbox` redirects |
| supabase auth mode | `lib/supabase-auth.ts` scaffold; wire `@supabase/ssr` when ready |

## still on the roadmap

live brief invite picker in composer, illustrated portrait assets, supabase otp wiring, track records on profiles (phase 5).
