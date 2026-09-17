import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

function loadEnv(): void {
  if (process.env.DATABASE_URL) return;
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../../.env'),
  ];
  for (const file of candidates) {
    if (existsSync(file)) {
      loadDotenv({ path: file });
      if (process.env.DATABASE_URL) break;
    }
  }
}

loadEnv();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';
export { PrismaClient };

