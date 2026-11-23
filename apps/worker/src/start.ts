import { Worker } from 'bullmq';
import { loadConfig } from '@catalogfix/config';
import { createLogger } from '@catalogfix/logger';
import { QUEUE_NAMES, bullConnection } from '@catalogfix/queue';
import { processImportJob } from './processors/import.processor';
import { processNormalizeJob } from './processors/normalization.processor';
import { processValidationJob } from './processors/validation.processor';
import { processExportJob } from './processors/export.processor';
import { processImageJob } from './processors/image.processor';
import { processAiJob } from './processors/ai.processor';
import { processEmailJob } from './processors/email.processor';
import { processShopifyJob } from './processors/shopify.processor';

/**
 * Starts every queue consumer. Used by the standalone worker process (main.ts) and,
 * with RUN_WORKER=true, inside the API process so a single free web service can do both.
 */
export function startWorkers(): Worker[] {
  const config = loadConfig();
  const logger = createLogger('worker');
  const connection = bullConnection(config.REDIS_URL);
  const concurrency = config.WORKER_CONCURRENCY;

  const workers = [
    new Worker(QUEUE_NAMES.CATALOG_IMPORT, processImportJob, { connection, concurrency }),
    new Worker(QUEUE_NAMES.CATALOG_NORMALIZE, processNormalizeJob, { connection, concurrency }),
    new Worker(QUEUE_NAMES.CATALOG_VALIDATION, processValidationJob, { connection, concurrency }),
    new Worker(QUEUE_NAMES.CATALOG_EXPORT, processExportJob, { connection, concurrency }),
    new Worker(QUEUE_NAMES.IMAGE_PROCESSING, processImageJob, { connection, concurrency: 2 }),
    new Worker(QUEUE_NAMES.CATALOG_AI, processAiJob, { connection, concurrency: 2 }),
    new Worker(QUEUE_NAMES.EMAIL, processEmailJob, { connection, concurrency: 2 }),
    new Worker(QUEUE_NAMES.SHOPIFY_SYNC, processShopifyJob, { connection, concurrency: 1 }),
  ];

  for (const worker of workers) {
    worker.on('failed', (job, error) => logger.error({ queue: worker.name, jobId: job?.id, err: error.message }, 'Job failed'));
    worker.on('error', (error) => logger.error({ queue: worker.name, err: error.message }, 'Worker error'));
  }

  logger.info({ concurrency }, 'CatalogFix worker started');
  return workers;
}
