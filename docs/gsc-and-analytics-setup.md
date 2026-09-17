# CatalogFix Search Console, Analytics & Monitoring Guide

This guide details the setup, verification, analytics tracking, and monitoring procedure for CatalogFix production deployment.

---

## 1. Google Search Console Setup Guide

### Step 1: Add Domain Property
1. Log into [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Select **Domain** (preferred because it covers `https://`, `http://`, `www`, and subdomains).
4. Enter `catalogfix.io`.

### Step 2: DNS Verification
1. Copy the TXT record provided by Google Search Console.
2. Add the TXT record in your DNS provider (e.g. Cloudflare / AWS Route53):
   - Type: `TXT`
   - Name: `@` or `catalogfix.io`
   - Content: `google-site-verification=...`
3. Click **Verify** in Search Console.

### Step 3: Sitemap Submission
1. In Search Console left menu, navigate to **Indexing** > **Sitemaps**.
2. Enter `https://catalogfix.io/sitemap.xml` under *Add a new sitemap*.
3. Click **Submit**.
4. Confirm status displays **Success** with valid URL count.

### Step 4: URL Inspection for Priority Pages
Use **URL Inspection** tool to request indexing for priority launch pages:
- `https://catalogfix.io/`
- `https://catalogfix.io/shopify-csv-converter`
- `https://catalogfix.io/supplier-csv-to-shopify`
- `https://catalogfix.io/shopify-csv-validator`
- `https://catalogfix.io/pricing`
- `https://catalogfix.io/tools/shopify-csv-validator`

---

## 2. GA4 Analytics Tracking & Privacy Specification

### Tracked Event Specification
Track customer conversion progress without sending sensitive catalog contents or SKU lists to third-party analytics servers.

| Event Name | Trigger Condition | Parameters | Privacy Control |
|---|---|---|---|
| `signup_started` | User clicks CTA to initiate signup | `source_page`, `cta_button` | No PII |
| `signup_completed` | User successfully creates account | `method` | No PII |
| `login` | User logs into dashboard | `method` | No PII |
| `catalog_upload_started` | User selects file for upload | `file_extension`, `file_size_mb` | NO filename or catalog data |
| `catalog_upload_completed` | File upload finishes | `row_count`, `column_count` | NO SKU or product names |
| `mapping_completed` | AI column mapping saved | `confidence_score` | NO column header text |
| `validation_completed` | Catalog validation run finishes | `error_count`, `warning_count` | NO row contents |
| `export_started` | User triggers Shopify CSV export | `format_target` | NO export payload |
| `export_completed` | File download finishes | `export_rows` | NO export payload |
| `pricing_viewed` | User views `/pricing` page | `plan_tier` | Public page event |
| `checkout_started` | User clicks plan purchase CTA | `plan_id`, `billing_cycle` | Payment metadata only |
| `subscription_started` | Payment confirmation received | `plan_id`, `value`, `currency` | Standard e-commerce event |
| `tool_used` | User executes a free ungated tool | `tool_name`, `issues_found` | NO user text inputs |

---

## 3. Bing Webmaster Tools Setup

1. Log into [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Import site verification directly from verified Google Search Console account.
3. Submit `https://catalogfix.io/sitemap.xml`.

---

## 4. Pre-Launch SEO Checklist

- [x] HTTPS enforced sitewide.
- [x] Canonical domain redirects working (`www` to non-`www`).
- [x] `robots.txt` accessible at `/robots.txt` with correct environment disallow policy.
- [x] `sitemap.xml` accessible at `/sitemap.xml` containing only canonical public indexable URLs.
- [x] All indexable pages have unique titles, descriptions, and canonical URLs.
- [x] JSON-LD schemas (`Organization`, `SoftwareApplication`, `BreadcrumbList`, `Article`, `FAQPage`) validate clean without fake ratings.
- [x] `404` page returns actual HTTP status 404 with navigation links.
- [x] Private app pages (`/dashboard/*`, `/account/*`, `/login`, `/signup`) omitted from sitemaps and blocked via robots/noindex rules.
- [x] Images optimized via `next/image` with natural alt attributes.
- [x] Core Web Vitals optimized (lightweight static landing pages).

---

## 5. Post-Launch 7-Day & 30-Day Monitoring Process

### 7-Day Review:
1. Verify Google Search Console sitemap status is green.
2. Inspect Coverage report for unexpected `Excluded` or `Crawled - currently not indexed` tags.
3. Verify server access logs for crawler 5xx or 4xx spikes.

### 30-Day Monthly Optimization:
1. Review Search Console **Performance** > **Search Results**.
2. Identify queries with high impressions but positions 5–20.
3. Improve titles, meta descriptions, content depth, FAQs, and internal links for those ranking URLs.
