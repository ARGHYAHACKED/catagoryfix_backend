import { Queue, type ConnectionOptions, type JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

export const QUEUE_NAMES = {
  CATALOG_IMPORT: 'catalog-import',
  CATALOG_NORMALIZE: 'catalog-normalize',
  CATALOG_VALIDATION: 'catalog-validation',
  CATALOG_AI: 'catalog-ai',
  IMAGE_PROCESSING: 'image-processing',
  CATALOG_EXPORT: 'catalog-export',
  SHOPIFY_SYNC: 'shopify-sync',
  EMAIL: 'email',
  WEBHOOKS: 'webhooks',
  RETENTION: 'retention-cleanup',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export function createRedisConnection(url: string): IORedis {
  return new IORedis(url, { maxRetriesPerRequest: null });
}

/**
 * BullMQ connection options from a redis:// or rediss:// URL.
 * Keeps the username (Redis 6 ACLs, e.g. Upstash's "default"), the DB index, and
 * turns on TLS for rediss:// — hosted Redis providers require both.
 */
export function bullConnection(url: string): ConnectionOptions {
  const parsed = new URL(url);
  const db = parsed.pathname.replace('/', '');
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined,
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    db: db ? Number(db) : undefined,
    tls: parsed.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null,
  };
}

export const defaultJobOptions: JobsOptions = {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: { count: 200 },
  removeOnFail: { count: 500 },
};

export function createQueue(name: QueueName, connection: ConnectionOptions): Queue {
  return new Queue(name, { connection, defaultJobOptions });
}

export interface ImportJobPayload {
  importId: string;
  organizationId: string;
  stage: 'parse-headers' | 'normalize';
}

export interface ExportJobPayload {
  exportId: string;
  organizationId: string;
}

export interface ImageJobPayload {
  importId: string;
  organizationId: string;
  fileId: string;
}
