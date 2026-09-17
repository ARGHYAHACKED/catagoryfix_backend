# API map (`/api/v1`)

Envelope:

Success: `{ "success": true, "data": ... }`
Error: `{ "success": false, "error": { "code", "message", "details" }, "requestId" }`

## Auth
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/refresh`
- POST `/auth/logout`
- POST `/auth/logout-all`
- POST `/auth/verify-email`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`

## Users
- GET `/users/me`
- PATCH `/users/me`

## Organizations
- GET `/organizations`
- POST `/organizations`
- GET `/organizations/:id`
- PATCH `/organizations/:id`
- GET `/organizations/:id/members`

## Uploads
- POST `/uploads/presign`

## Imports
- POST `/imports`
- GET `/imports`
- GET `/imports/:id`
- DELETE `/imports/:id`
- POST `/imports/:id/files/confirm`
- POST `/imports/:id/process`
- GET `/imports/:id/progress`
- GET `/imports/:id/events` (SSE)

## Mappings
- GET `/imports/:id/columns`
- GET `/imports/:id/mappings`
- PUT `/imports/:id/mappings`

## Products
- GET `/imports/:id/products`
- GET `/products/:id`
- PATCH `/products/:id`

## Validation
- GET `/imports/:id/issues`
- GET `/imports/:id/validation-summary`
- POST `/issues/:id/resolve`

## Exports
- POST `/exports`
- GET `/exports`
- GET `/exports/:id`
- GET `/exports/:id/download`

## Billing / usage
- POST `/billing/checkout`
- POST `/billing/portal`
- GET `/billing/subscription`
- GET `/usage/current`

## AI
- POST `/ai/jobs`
- GET `/ai/jobs/:id`

## Webhooks
- POST `/webhooks/stripe`

## Health
- GET `/health`
- GET `/health/live`
- GET `/health/ready`
