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

async function main(): Promise<void> {
  const config = loadConfig();
  const logger = createLogger('worker');
  const connection = bullConnection(config.REDIS_URL);
  const concurrency = config.WORKER_CONCURRENCY;

  new Worker(QUEUE_NAMES.CATALOG_IMPORT, processImportJob, { connection, concurrency });
  new Worker(QUEUE_NAMES.CATALOG_NORMALIZE, processNormalizeJob, { connection, concurrency });
  new Worker(QUEUE_NAMES.CATALOG_VALIDATION, processValidationJob, { connection, concurrency });
  new Worker(QUEUE_NAMES.CATALOG_EXPORT, processExportJob, { connection, concurrency });
  new Worker(QUEUE_NAMES.IMAGE_PROCESSING, processImageJob, { connection, concurrency: 2 });
  new Worker(QUEUE_NAMES.CATALOG_AI, processAiJob, { connection, concurrency: 2 });
  new Worker(QUEUE_NAMES.EMAIL, processEmailJob, { connection, concurrency: 2 });
  new Worker(QUEUE_NAMES.SHOPIFY_SYNC, processShopifyJob, { connection, concurrency: 1 });

  logger.info({ concurrency }, 'CatalogFix worker started');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
