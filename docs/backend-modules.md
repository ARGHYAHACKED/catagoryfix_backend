# Backend modules (`apps/api`)

| Module | Path | Responsibility |
| --- | --- | --- |
| Auth | `src/auth` | Register, login, refresh rotation, logout, verify, reset |
| Users | `src/users` | Current user profile |
| Organizations | `src/organizations` | Workspaces and membership |
| Uploads | `src/uploads` | Presigned R2/MinIO PUT URLs |
| Imports | `src/imports` | Import jobs, mapping, progress, products list |
| Products | `src/products` | Product editor and issue resolution |
| Exports | `src/exports` | Queue Shopify CSV export and signed download |
| Billing | `src/billing` | Stripe checkout/portal and usage |
| Webhooks | `src/webhooks` | Idempotent Stripe webhook |
| Dashboard | `src/dashboard` | Home summary |
| Health | `src/health` | Live/ready probes |
| Common | `src/common` | Auth/org guards, envelopes, entitlements, crypto |

Worker processors live in `apps/worker/src/processors` and call `packages/*` for parse/normalize/validate/export.
