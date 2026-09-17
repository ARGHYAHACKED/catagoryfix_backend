import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

function loadEnvFiles(): void {
  const candidates = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../../.env'),
  ];
  for (const file of candidates) {
    if (existsSync(file)) {
      loadDotenv({ path: file, override: false });
    }
  }
}

loadEnvFiles();

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true' || value === '1';
  }
  return false;
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  WEB_URL: z.string().url(),
  API_URL: z.string().url(),
  API_PREFIX: z.string().default('/api/v1'),
  API_PORT: z.coerce.number().default(3001),
  WORKER_CONCURRENCY: z.coerce.number().default(5),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.coerce.number().default(900),
  JWT_REFRESH_TTL: z.coerce.number().default(604800),
  PASSWORD_PEPPER: z.string().min(8),
  ENCRYPTION_KEY: z.string().min(32),
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_SECURE: booleanFromEnv.default(false),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_ENDPOINT: z.string().url(),
  R2_PUBLIC_URL: z.string().optional(),
  R2_FORCE_PATH_STYLE: booleanFromEnv.default(true),
  R2_REGION: z.string().default('auto'),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_PUBLISHABLE_KEY: z.string().optional().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  STRIPE_STARTER_PRICE_ID: z.string().optional().default(''),
  STRIPE_BUSINESS_PRICE_ID: z.string().optional().default(''),
  STRIPE_PRO_PRICE_ID: z.string().optional().default(''),
  RESEND_API_KEY: z.string().optional().default(''),
  EMAIL_FROM: z.string().default('CatalogFix <noreply@localhost>'),
  SENTRY_DSN: z.string().optional().default(''),
  FILE_RETENTION_FREE_DAYS: z.coerce.number().default(7),
  FILE_RETENTION_PAID_DAYS: z.coerce.number().default(30),
  MAX_UPLOAD_BYTES: z.coerce.number().default(52_428_800),
});

export type AppConfig = z.infer<typeof envSchema>;

let cached: AppConfig | undefined;

export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  if (cached) {
    return cached;
  }
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

export function resetConfigCache(): void {
  cached = undefined;
}
