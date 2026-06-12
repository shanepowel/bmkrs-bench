# archived fnm marketplace routes

retired from `apps/web/src/app` on 2026-06-12. the bench app is not the freelance near me marketplace.

these pages are kept for reference only. live traffic is redirected in `apps/web/next.config.ts`:

| old path | redirect |
|---|---|
| `/jobs`, `/jobs/*` | `/studio/briefs` |
| `/talents`, `/categories` | `/studio/bench` |
| `/freelancers/:username` | `/partners/:username` |
| `/hire/:skill` | `/hire` |
| `/about`, `/how-it-works` | `/` |

do not re-enable without stripping fnm copy and wiring to bench data models.
