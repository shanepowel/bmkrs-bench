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

## Cursor Cloud specific instructions

Dependencies are refreshed automatically on VM start (`npm install` here + `npm ci --legacy-peer-deps` in the sibling `bmkrs.com/web` repo). The notes below cover the non-obvious bring-up steps the update script intentionally does **not** do.

**Database (PostgreSQL).** Cloud VMs have no Docker, and `npx prisma dev` does not start here, so `npm run setup:dev` fails. Use a native PostgreSQL cluster instead. Critical gotcha: `packages/database/src/database-url.ts` treats `localhost` and `127.0.0.1` as *placeholder* hosts and ignores them, so a `localhost` `DATABASE_URL` resolves to `placeholder` and auth fails. Use a non-loopback alias (e.g. `benchdb` → `127.0.0.1` in `/etc/hosts`). Non-local hosts make the `@prisma/adapter-pg` driver use TLS; Ubuntu's Postgres ships with `ssl = on`, and the driver connects with `rejectUnauthorized: false`, so it just works. Bring-up (idempotent):

```bash
sudo pg_ctlcluster 16 main start || true
grep -q benchdb /etc/hosts || echo "127.0.0.1 benchdb" | sudo tee -a /etc/hosts
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='fnm'" | grep -q 1 || sudo -u postgres psql -c "CREATE ROLE fnm LOGIN PASSWORD 'fnm_dev_password'"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='freelancenearme'" | grep -q 1 || sudo -u postgres createdb -O fnm freelancenearme
DB='postgresql://fnm:fnm_dev_password@benchdb:5432/freelancenearme?schema=public'
printf 'DATABASE_URL="%s"\nDEV_AUTH_BYPASS=false\nNEXT_PUBLIC_APP_URL=http://localhost:3001\nAPP_URL=http://localhost:3001\n' "$DB" > apps/web/.env
echo "DATABASE_URL=\"$DB\"" > packages/database/.env
npm run db:push && npm run db:seed   # .env files are gitignored — recreate each session
```

**Auth gotcha (redirect loop).** With Clerk unconfigured (the local default), do **not** set `DEV_AUTH_BYPASS=true`: the login page honours the bypass and redirects to `/home`, but `/home`'s `requireUser()` uses the cookie-based bench session and bounces back to `/login` — an infinite loop. Set `DEV_AUTH_BYPASS=false` and use the email-link cookie login at `/login`. Any email works in dev; the role is inferred from the address (`client…`→client, `partner…`→partner, `studio…`/`shane…`→studio). Seeded users: `client@demo.bmkrs.com`, `partner@demo.bmkrs.com`.

**Lint.** `next lint` was removed in Next 16, so the repo `lint` script is broken and there is no ESLint config in `apps/web`; type-safety is covered by `npm run build`. Dev server runs on port **3001**.
