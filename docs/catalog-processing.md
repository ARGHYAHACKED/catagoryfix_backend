# Catalog processing

## Pipeline

1. Presigned upload of CSV/XLSX to object storage
2. Confirm file → `ImportFile` metadata in PostgreSQL
3. `catalog-import` job downloads the object, detects encoding/delimiter/headers
4. Status `MAPPING_REQUIRED`; sample values stored on the job
5. User confirms `ColumnMapping`
6. `catalog-normalize` parses rows in chunks, groups variants, normalizes fields into `CatalogProduct`
7. Persist `Product`, `ProductVariant`, options, images, tags
8. `catalog-validation` writes `ValidationIssue` rows
9. Status `READY` when no blocking errors, else products may be `INVALID`
10. `catalog-export` loads normalized products, Shopify mapper + CSV generator, upload to R2, signed download

## Internal types

See `@catalogfix/catalog-core` `CatalogProduct`. Shopify Handle/Option1 columns exist only in `@catalogfix/shopify`.

## CSV security

Exported cells that start with `=`, `+`, `-`, `@`, or tab/CR are prefixed to prevent spreadsheet formula execution.

## Image ZIP (architecture, worker-backed)

ZIP is extracted off-request with zip-slip protection, extension allowlists, and size caps. Filename matching (`ABC123.jpg`) is the V1 matcher.
