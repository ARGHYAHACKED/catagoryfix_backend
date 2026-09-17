# CatalogFix

Turn messy supplier catalogs into store-ready products.

Upload CSV/Excel supplier files, map columns, normalize products, validate data, and export a Shopify-ready CSV.

---

## What you have to run

You run **two commands** after the first-time setup.

| # | What | Command | Why |
| --- | --- | --- | --- |
| 1 | Infrastructure (Docker) | `pnpm infra:up` | Postgres, Redis, MinIO (local file storage) |
| 2 | App processes | `pnpm dev` | Web + API + worker together |

`pnpm dev` starts **3 Node servers** in one terminal:

| Process | Package | Port | Required? |
| --- | --- | --- | --- |
| Web (Next.js) | `@catalogfix/web` | **3000** | Yes |
| API (NestJS) | `@catalogfix/api` | **3001** | Yes |
| Worker (BullMQ) | `@catalogfix/worker` | none | Yes — parsing, validation, and CSV export |

If you prefer **3 separate terminals**:

```bash
pnpm infra:up
pnpm dev:api
pnpm dev:worker
pnpm dev:web
```

Docker Compose starts these containers (one command, not extra terminals):

| Container | Port | Role |
| --- | --- | --- |
| `catalogfix-postgres` | 5432 | Database |
| `catalogfix-redis` | 6379 | Job queue |
| `catalogfix-minio` | 9000 API / 9001 console | File uploads (local R2) |
| `catalogfix-minio-init` | — | Creates the bucket, then exits |

You do **not** run API/worker/web as Docker containers in local development.

---

## First-time setup

Requirements: **Node.js 22+**, **pnpm 9**, **Docker Desktop**.

```bash
cd CatalogFix-or-CSV_FILE_SORTER

copy .env.example .env
pnpm install

pnpm infra:up
pnpm db:generate
pnpm db:migrate:deploy
```

On macOS/Linux use `cp .env.example .env` instead of `copy`.

Then start apps:

```bash
pnpm dev
```

Open:

| URL | What |
| --- | --- |
| http://localhost:3000 | App (signup / dashboard) |
| http://localhost:3000/signup | Create account (also creates a workspace) |
| http://localhost:3001/api/v1/health | API health |
| http://localhost:3001/docs | Swagger |
| http://localhost:9001 | MinIO console (`minio` / `miniosecret`) |

Try the flow: **New Import** → upload `fixtures/simple-products.csv` → map columns → process → **Export Shopify CSV**.

Stop apps with `Ctrl+C`. Stop Docker with `pnpm infra:down`.

---

## Environment variables

Keep **one file** at the repo root: `.env` (copied from `.env.example`).

The API and worker load that file automatically. Next.js also loads it for `NEXT_PUBLIC_*` values.

Never put secrets in `NEXT_PUBLIC_*`. Those are sent to the browser.

### Required to start locally

These already have working local defaults in `.env.example`. Keep them unless you change Docker.

| Variable | Local default | Used by |
| --- | --- | --- |
| `NODE_ENV` | `development` | All |
| `WEB_URL` | `http://localhost:3000` | API CORS + Stripe return URLs |
| `API_URL` | `http://localhost:3001` | API identity |
| `API_PREFIX` | `/api/v1` | API routes |
| `API_PORT` | `3001` | API listen port |
| `WORKER_CONCURRENCY` | `5` | Worker job parallelism |
| `DATABASE_URL` | `postgresql://catalogfix:catalogfix@localhost:5432/catalogfix?schema=public` | API, worker, Prisma |
| `REDIS_URL` | `redis://localhost:6379` | Queues |
| `JWT_ACCESS_SECRET` | 32+ character string | Auth cookies |
| `JWT_REFRESH_SECRET` | 32+ character string | Refresh tokens |
| `JWT_ACCESS_TTL` | `900` (seconds = 15 min) | Access cookie life |
| `JWT_REFRESH_TTL` | `604800` (7 days) | Refresh cookie life |
| `PASSWORD_PEPPER` | 8+ character string | Password hashing |
| `ENCRYPTION_KEY` | 32+ character string | Encrypted integration credentials |
| `COOKIE_DOMAIN` | `localhost` | Cookies |
| `COOKIE_SECURE` | `false` | Set `true` only on HTTPS |
| `R2_ACCOUNT_ID` | `local` | Object storage |
| `R2_ACCESS_KEY_ID` | `minio` | Must match Docker MinIO user |
| `R2_SECRET_ACCESS_KEY` | `miniosecret` | Must match Docker MinIO password |
| `R2_BUCKET` | `catalogfix` | Storage bucket |
| `R2_ENDPOINT` | `http://localhost:9000` | MinIO S3 API |
| `R2_PUBLIC_URL` | `http://localhost:9000/catalogfix` | Optional public object URL |
| `R2_FORCE_PATH_STYLE` | `true` | Required for MinIO |
| `R2_REGION` | `auto` | S3 region |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api/v1` | Browser API calls |
| `MAX_UPLOAD_BYTES` | `52428800` (50 MB) | Upload limit |
| `FILE_RETENTION_FREE_DAYS` | `7` | Cleanup policy |
| `FILE_RETENTION_PAID_DAYS` | `30` | Cleanup policy |
| `EMAIL_FROM` | `CatalogFix <noreply@localhost>` | Outbound From header |

### Optional — leave empty for local MVP

The import → Shopify CSV path works **without** these.

| Variable | Feature if set |
| --- | --- |
| `OPENAI_API_KEY` | AI title/description/SEO (not required for CSV export) |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `STRIPE_SECRET_KEY` | Paid plans / checkout |
| `STRIPE_PUBLISHABLE_KEY` | Stripe.js (if you add it later) |
| `STRIPE_WEBHOOK_SECRET` | Billing webhooks |
| `STRIPE_STARTER_PRICE_ID` | Starter plan price |
| `STRIPE_BUSINESS_PRICE_ID` | Business plan price |
| `STRIPE_PRO_PRICE_ID` | Pro plan price |
| `RESEND_API_KEY` | Transactional email |
| `SENTRY_DSN` | Error monitoring |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics (browser) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host |

---

## Useful commands

```bash
pnpm infra:up              # start Postgres, Redis, MinIO
pnpm infra:logs            # follow Docker logs
pnpm infra:down            # stop Docker

pnpm dev                   # web + API + worker
pnpm dev:web
pnpm dev:api
pnpm dev:worker

pnpm db:generate           # Prisma client
pnpm db:migrate:deploy     # apply migrations
pnpm db:migrate            # create a new migration (dev)
pnpm db:studio             # database UI
pnpm db:seed

pnpm test
pnpm build
```

---

## Architecture

Monorepo (pnpm + Turborepo):

- `apps/web` — Next.js dashboard
- `apps/api` — NestJS REST API (`/api/v1`)
- `apps/worker` — background catalog processing
- `packages/*` — shared catalog, validation, Shopify export, storage, queue, Prisma

PostgreSQL is the source of truth. Redis is queues only. Files go to MinIO locally (Cloudflare R2 in production). Supplier files are uploaded **directly from the browser** to object storage, not through the API body.

More detail: `docs/architecture.md`, `docs/api.md`, `docs/database.md`.

---

## Production notes

- Use `pnpm db:migrate:deploy` before starting API/worker
- Point `R2_*` at Cloudflare R2, not MinIO
- Set `COOKIE_SECURE=true` and a real `COOKIE_DOMAIN`
- Rotate all JWT / encryption secrets
- Do not put secrets in `NEXT_PUBLIC_*`
- See `docs/deployment.md`
