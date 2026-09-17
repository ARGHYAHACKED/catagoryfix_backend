# Database

PostgreSQL is the source of truth. Prisma migrations are required; `db push` is not a production strategy.

## ER summary

```
User 1──* Session
User 1──* RefreshToken
User 1──* EmailVerificationToken
User 1──* PasswordResetToken
User *──* Organization  (via OrganizationMember)
Organization 1──1 Subscription
Organization 1──* UsageRecord
Organization 1──* ImportJob ──* ImportFile
ImportJob 1──* ColumnMapping
ImportJob 1──* Product ──* ProductVariant
Product 1──* ProductOption ──* ProductOptionValue
Product 1──* ProductImage
Product 1──* ProductTag
ImportJob 1──* ValidationIssue
Organization 1──* ExportJob ──* ExportFile
Organization 1──* Integration ──1 ShopifyStore
Organization 1──* AIJob
Organization 1──* AuditLog
Organization 1──* APIKey
WebhookEvent (idempotency store, global)
```

## Indexing

Unique: `User.email`, `Organization.slug`, `OrganizationMember(userId, organizationId)`, `UsageRecord(organizationId, period)`, `WebhookEvent.providerEventId`.

Query indexes: import/org/status, product import/sku/barcode/status, variant product/sku, validation import/product, export org, integration org.

## Soft delete

`User`, `Organization`, `ImportJob`, and `Product` use `deletedAt` where recovery matters. Object storage files follow plan retention and scheduled cleanup.
