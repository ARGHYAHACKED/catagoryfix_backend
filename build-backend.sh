#!/usr/bin/env bash
set -e

echo "=== Step 1: Installing pnpm globally ==="
npm install -g pnpm@9.15.0

echo "=== Step 2: Installing workspace dependencies ==="
pnpm install --frozen-lockfile

echo "=== Step 3: Generating Prisma Client ==="
pnpm --filter @catalogfix/database generate

echo "=== Step 4: Building all monorepo packages and apps ==="
pnpm build
