# CatalogFix Production Deployment Guide

This guide covers deploying **CatalogFix** with:
- **Frontend (Next.js)** on **Vercel** (`catalogfix.in` & `www.catalogfix.in`)
- **Backend API (NestJS)** & **Worker (BullMQ)** on **Render** (`api.catalogfix.in`)
- **Database (PostgreSQL)** & **Redis** on **Render** (or managed providers)
- **Object Storage** on **Cloudflare R2**

---

## 1. Domain Setup Architecture

| Subdomain / Host | Service | Hosted On | Purpose |
| --- | --- | --- | --- |
| `catalogfix.in` | `@catalogfix/web` | Vercel | Main Web App Frontend |
| `www.catalogfix.in` | Redirect / Web | Vercel | Web App alias |
| `api.catalogfix.in` | `@catalogfix/api` | Render | NestJS REST API |
| *(Internal worker)* | `@catalogfix/worker` | Render | Background queue worker |

---

## 2. Step-by-Step Instructions

### STEP 1: Cloudflare R2 Setup (Object Storage)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **R2 Object Storage**.
2. Create a bucket named `catalogfix-prod`.
3. Create an **API Token** with `Admin Read & Write` permissions.
4. Note down:
   - Account ID
   - Access Key ID
   - Secret Access Key
   - Public Bucket URL (or custom R2 domain)

---

### STEP 2: Render Deployment (Backend API + Worker + DB + Redis)

You can use the included `render.yaml` Blueprint or create services manually:

#### Option A: Automatic via Render Blueprint (Recommended)
1. Push your repository code to GitHub/GitLab.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml` and prompt for required secrets:
   - `JWT_ACCESS_SECRET` (generate random 32+ char string)
   - `JWT_REFRESH_SECRET` (generate random 32+ char string)
   - `PASSWORD_PEPPER` (generate random 8+ char string)
   - `ENCRYPTION_KEY` (generate random 32 char string)
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`, `R2_PUBLIC_URL`
4. Click **Apply**. Render will provision PostgreSQL, Redis, NestJS Web Service (`catalogfix-api`), and Worker (`catalogfix-worker`).

#### Custom Domain on Render for API:
1. Open the `catalogfix-api` service in Render.
2. Go to **Settings** -> **Custom Domains**.
3. Add `api.catalogfix.in`.
4. Copy the target CNAME provided by Render (e.g. `catalogfix-api.onrender.com`).

---

### STEP 3: Vercel Deployment (Frontend Next.js)

1. Go to [Vercel Dashboard](https://vercel.com/) -> **Add New Project**.
2. Import your GitHub repository.
3. Configure Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` (or root with monorepo auto-detection)
   - **Build Command**: `pnpm --filter @catalogfix/web build`
   - **Install Command**: `pnpm install`
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://api.catalogfix.in/api/v1`
5. Click **Deploy**.

#### Custom Domain on Vercel:
1. In Vercel, go to **Project Settings** -> **Domains**.
2. Add `catalogfix.in` and `www.catalogfix.in`.

---

### STEP 4: DNS Configuration (at your Domain Registrar e.g. GoDaddy / Namecheap / Hostinger / Cloudflare)

In your domain provider's DNS Manager for `catalogfix.in`, set the following DNS records:

| Type | Name / Host | Value / Target | TTL | Purpose |
| --- | --- | --- | --- | --- |
| **A** | `@` | `76.76.21.21` | Auto | Points `catalogfix.in` to Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com` | Auto | Points `www.catalogfix.in` to Vercel |
| **CNAME** | `api` | `catalogfix-api.onrender.com` | Auto | Points `api.catalogfix.in` to Render API |

---

## 3. Production Environment Variables Summary

### Render (API & Worker Environment Variables)

```env
NODE_ENV=production
WEB_URL=https://catalogfix.in
API_URL=https://api.catalogfix.in
API_PREFIX=/api/v1
API_PORT=10000
WORKER_CONCURRENCY=5

DATABASE_URL=postgresql://<user>:<password>@<render-db-host>/catalogfix
REDIS_URL=rediss://<user>:<password>@<render-redis-host>

COOKIE_DOMAIN=.catalogfix.in
COOKIE_SECURE=true

JWT_ACCESS_SECRET=<secret-32-chars-min>
JWT_REFRESH_SECRET=<secret-32-chars-min>
JWT_ACCESS_TTL=900
JWT_REFRESH_TTL=604800
PASSWORD_PEPPER=<random-pepper-string>
ENCRYPTION_KEY=<32-bytes-hex-key>

R2_ACCOUNT_ID=<r2-account-id>
R2_ACCESS_KEY_ID=<r2-access-key-id>
R2_SECRET_ACCESS_KEY=<r2-secret-access-key>
R2_BUCKET=catalogfix-prod
R2_ENDPOINT=https://<r2-account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://<custom-r2-domain-or-pub-url>
R2_FORCE_PATH_STYLE=false
R2_REGION=auto
```

### Vercel (Frontend Environment Variables)

```env
NEXT_PUBLIC_API_URL=https://api.catalogfix.in/api/v1
```

---

## 4. Verification Checklist

1. [ ] Visit `https://api.catalogfix.in/api/v1/health` -> returns `{"status":"ok"}`.
2. [ ] Visit `https://catalogfix.in` -> Next.js app loads with SSL certificate active.
3. [ ] Test Account Signup & Login on `https://catalogfix.in` -> Auth cookie `cf_access` is set with domain `.catalogfix.in`.
4. [ ] Upload a file to test Cloudflare R2 presigned URL generation and background processing.
