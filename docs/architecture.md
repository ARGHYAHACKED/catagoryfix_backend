# CatalogFix Architecture

CatalogFix is a multi-tenant SaaS that converts messy supplier catalogs into platform-ready product data. The first export target is Shopify CSV. WooCommerce, Amazon, and eBay are added later as adapters, not by rewriting the core.

## Product principle

Reliable ecommerce product-data transformation comes first. AI enrichment is optional and never mutates SKU, barcode, price, cost, inventory, or supplier IDs without explicit user confirmation.

## Runtime topology

```
Browser (apps/web)
  → REST /api/v1 (apps/api)
      → PostgreSQL (source of truth)
      → Redis (queues, rate limits, short cache)
      → Object storage (R2 / MinIO)
      → enqueue jobs
Worker (apps/worker)
  → download files from object storage
  → catalog-core parse / map / normalize / validate
  → persist products
  → platform-core + shopify export
  → upload generated files
```

Large supplier files never pass through the API process body. The browser uploads directly to object storage using presigned URLs.

## Monorepo packages

| Package | Responsibility |
| --- | --- |
| `@catalogfix/database` | Prisma schema, client, migrations |
| `@catalogfix/config` | Environment validation |
| `@catalogfix/logger` | Structured JSON logging |
| `@catalogfix/types` | Cross-app DTOs and enums |
| `@catalogfix/storage` | S3-compatible storage + presign |
| `@catalogfix/queue` | BullMQ queue names and factories |
| `@catalogfix/catalog-core` | Parse, detect, map, normalize, group |
| `@catalogfix/validation` | Catalog validation engine |
| `@catalogfix/platform-core` | Exporter / commerce integration interfaces |
| `@catalogfix/shopify` | Shopify CSV mapper and generator |
| `@catalogfix/ai` | OpenAI structured enrichment |

Business logic lives in packages. `apps/api` and `apps/worker` orchestrate; they do not duplicate parsers or exporters.

## Multi-tenancy

Every catalog artifact belongs to an `Organization`. Membership is checked on the server. Client-supplied organization IDs are never trusted without a membership lookup.

## Normalized catalog

Supplier files are never mapped directly to Shopify. Parsers emit rows → column mapping → `CatalogProduct[]` → validation → persistence → platform exporter.

## Queues

- `catalog-import` parse headers / rows
- `catalog-normalize` grouping + field normalization
- `catalog-validation` issue generation
- `catalog-ai` batched enrichment
- `image-processing` ZIP extract + SKU filename match
- `catalog-export` platform file generation
- `shopify-sync` future Admin API
- `email` transactional mail
- `webhooks` outbound / inbound processing
- `retention-cleanup` expired object deletion

Jobs are idempotent via `ImportJob` / `ExportJob` status guards and unique job IDs.

## Auth

First-party email/password with httpOnly cookies, access + rotating refresh tokens, email verification, and password reset. Google OAuth can attach later to the same `User` record.

## Billing

Stripe webhooks are the source of subscription truth. Entitlements are centralized in `EntitlementService`.
