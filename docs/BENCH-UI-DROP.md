# bench ui drop

integrated from the bench-app code drop. single source: `apps/web/src/lib/bench-ui.tsx`.

## what's wired

| drop file | bench location | notes |
|---|---|---|
| `bench-ui.tsx` | `src/lib/bench-ui.tsx` | tokens, Status dot, NavRail, forms, buttons |
| `page.tsx` | `src/app/page.tsx` | public home; clerk redirect when signed in |
| `apply/page.tsx` | `src/app/apply/page.tsx` | intake form → sign-up applicant; draft in sessionStorage |
| `login/page.tsx` | `src/app/login/page.tsx` | redirects to `/sign-in` (clerk) |
| `bench/page.tsx` | `src/app/studio/bench/page.tsx` | studio bench table with live prisma data |
| `api/*` stubs | not used | clerk + prisma handle auth and applications |

## chrome

marketing pages (`/`, `/apply`) render without the top nav header. authenticated areas use `BenchChrome` (site header) via per-section layouts.

## nav rail (phase 2 ui)

shared shell: `BenchAppShell` + `lib/nav-rail.ts`. studio, partner, and client home views use `NavRail` + paper canvas + ruled tables + `Status` + one orange action.

| view | route |
|---|---|
| studio home | `/studio` |
| pipeline queue + applicant | `/studio/pipeline`, `/studio/pipeline/[id]` |
| brief composer | `/studio/briefs` |
| bench search | `/studio/bench` |
| partner home | `/partner` |
| client your-team | `/client` |
