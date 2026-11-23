#!/usr/bin/env bash
set -e

echo "=== Step 1: Installing pnpm globally ==="
npm install -g pnpm@9.15.0

echo "=== Step 2: Installing workspace dependencies ==="
# Render exposes NODE_ENV=production at build time, which makes pnpm skip
# devDependencies (prisma, typescript, turbo). Force them in for the build.
pnpm install --frozen-lockfile --prod=false

echo "=== Step 3: Generating Prisma Client and building packages ==="
pnpm --filter @catalogfix/database exec prisma generate --schema=prisma/schema.prisma
pnpm --filter "./packages/*" build

echo "=== Step 4: Building the API and the worker (not the Next.js web app) ==="
# The API can run the worker in-process (RUN_WORKER=true), so both must be built.
pnpm --filter @catalogfix/api... --filter @catalogfix/worker... build

echo "=== Build check ==="
test -f apps/api/dist/main.js && echo "API build OK"
test -f apps/worker/dist/start.js && echo "Worker build OK"

