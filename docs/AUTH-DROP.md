# auth drop (dev mode)

integrated from the bench-app auth code drop. clerk remains the production path when both keys are set.

## dev sign-in (zero setup)

when clerk is not configured, or `AUTH_MODE=dev`:

1. visit `/login`
2. enter any email — session cookie is set instantly
3. redirect to `/home` (role-aware dashboard)

role is inferred from the email for local testing:

| email contains | role | seed user |
|---|---|---|
| `studio` or `shane` | studio | `seed_studio_1` |
| `client` | client | `seed_client_1` |
| anything else | partner | `seed_talent_1` |

sign out via the link on `/home` (posts to `/api/logout`).

## files

| drop | bench location |
|---|---|
| `auth.ts` | `lib/bench-session.ts` + extensions in `lib/auth.ts` |
| `middleware.ts` | `middleware.ts` (bench cookie gate or clerk) |
| `page.tsx` | `app/home/page.tsx` |
| `login/page.tsx` | `app/login/page.tsx` |
| `api/login/route.ts` | `app/api/login/route.ts` |
| `api/logout/route.ts` | `app/api/logout/route.ts` |
| `auth/callback/route.ts` | `app/auth/callback/route.ts` (supabase stub) |

## production

set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` on vercel. clerk middleware protects routes; `/sign-in` replaces `/login`.

## supabase mode (scaffold)

set `AUTH_MODE=supabase` plus:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server)
- `APP_URL` (redirect target)

`/api/login` and `/auth/callback` call `lib/supabase-auth.ts`:

1. email must exist in the bench `User` table (no public sign-up via magic link)
2. `signInWithOtp` sends the link
3. `/auth/callback` exchanges the code, then sets the bench session cookie with the prisma user's role

middleware treats `AUTH_MODE=supabase` like dev mode (bench cookie gate).
