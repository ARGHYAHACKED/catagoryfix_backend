import type { Job } from 'bullmq';
import { Prisma } from '@catalogfix/database';
import { prisma } from '@catalogfix/database';
import { parseCatalogBuffer, rowsToCatalog, type CatalogProduct } from '@catalogfix/catalog-core';
import { createStorageClient, ObjectStorage } from '@catalogfix/storage';
import { loadConfig } from '@catalogfix/config';
import { bullConnection, createQueue, QUEUE_NAMES, type ImportJobPayload } from '@catalogfix/queue';
import { createLogger } from '@catalogfix/logger';
import { currentPeriod } from './period';

const logger = createLogger('worker');
const CHUNK = 250;

export async function processNormalizeJob(job: Job<ImportJobPayload>): Promise<void> {
  const { importId, organizationId } = job.data;
  const importJob = await prisma.importJob.findFirst({
    where: { id: importId, organizationId, deletedAt: null },
    include: { files: true, mappings: true },
  });
  if (!importJob) {
    return;
  }
  if (importJob.status === 'READY' || importJob.status === 'COMPLETED') {
    return;
  }
  const catalogFile = importJob.files.find((file) => file.type === 'CATALOG');
  if (!catalogFile) {
    await prisma.importJob.update({
      where: { id: importId },
      data: { status: 'FAILED', errorCode: 'FILE_MISSING', errorMessage: 'Catalog file is missing.' },
    });
    return;
  }

  await prisma.importJob.update({
    where: { id: importId },
    data: {
      status: 'PROCESSING',
      currentStage: 'Parsing rows',
      progressPercentage: 35,
      processingLock: job.id,
    },
  });

  const config = loadConfig();
  const storage = new ObjectStorage(createStorageClient(config), config.R2_BUCKET);
  const buffer = await storage.getBuffer(catalogFile.storageKey);
  const parsed = parseCatalogBuffer(buffer, catalogFile.originalName, catalogFile.mimeType, importJob.selectedSheet ?? undefined);
  const mapping: Record<string, string> = {};
  for (const item of importJob.mappings) {
    mapping[item.sourceColumn] = item.targetField;
  }

  await prisma.importJob.update({
    where: { id: importId },
    data: { currentStage: 'Grouping variants', progressPercentage: 45, totalRows: parsed.rows.length },
  });

  const products = rowsToCatalog(parsed.rows, mapping);

  await prisma.importJob.update({
    where: { id: importId },
    data: { currentStage: 'Normalizing products', progressPercentage: 55 },
  });

  await prisma.product.deleteMany({ where: { importId } });

  for (let i = 0; i < products.length; i += CHUNK) {
    const slice = products.slice(i, i + CHUNK);
    await persistProducts(importId, slice);
    await prisma.importJob.update({
      where: { id: importId },
      data: {
        processedRows: Math.min(parsed.rows.length, i + slice.length),
        successfulRows: i + slice.length,
        progressPercentage: 55 + Math.round(((i + slice.length) / products.length) * 20),
      },
    });
  }

  await prisma.usageRecord.upsert({
    where: { organizationId_period: { organizationId, period: currentPeriod() } },
    update: { productsProcessed: { increment: products.length } },
    create: { organizationId, period: currentPeriod(), productsProcessed: products.length },
  });

  const validationQueue = createQueue(QUEUE_NAMES.CATALOG_VALIDATION, bullConnection(config.REDIS_URL));
  await prisma.importJob.update({
    where: { id: importId },
    data: { status: 'VALIDATING', currentStage: 'Validating', progressPercentage: 80 },
  });
  await validationQueue.add(
    'validate',
    { importId, organizationId, stage: 'normalize' },
    { jobId: `validate-${importId}` },
  );
  logger.info({ jobId: job.id, importId, count: products.length }, 'Normalized catalog');
}

async function persistProducts(importId: string, products: CatalogProduct[]): Promise<void> {
  for (const product of products) {
    await prisma.product.create({
      data: {
        importId,
        externalId: product.externalId,
        sku: product.sku,
        title: product.title || 'Untitled product',
        handle: product.handle,
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        vendor: product.vendor,
        productType: product.productType,
        status: 'PROCESSING',
        price: Number.isFinite(product.price) ? product.price : undefined,
        compareAtPrice: Number.isFinite(product.compareAtPrice) ? product.compareAtPrice : undefined,
        cost: Number.isFinite(product.cost) ? product.cost : undefined,
        barcode: product.barcode,
        seoTitle: product.seo?.title,
        seoDescription: product.seo?.description,
        rawData: JSON.parse(JSON.stringify(product.metadata ?? {})) as Prisma.InputJsonValue,
        normalizedData: JSON.parse(JSON.stringify(product)) as Prisma.InputJsonValue,
        variants: {
          create: product.variants.map((variant) => ({
            sku: variant.sku,
            barcode: variant.barcode,
            price: Number.isFinite(variant.price) ? variant.price : undefined,
            compareAtPrice: Number.isFinite(variant.compareAtPrice) ? variant.compareAtPrice : undefined,
            cost: Number.isFinite(variant.cost) ? variant.cost : undefined,
            inventoryQuantity: Number.isFinite(variant.inventoryQuantity) ? variant.inventoryQuantity : undefined,
            weight: Number.isFinite(variant.weight) ? variant.weight : undefined,
            weightUnit: variant.weightUnit,
            optionValues: variant.optionValues as Prisma.InputJsonValue,
            rawData: (variant.metadata ?? {}) as Prisma.InputJsonValue,
          })),
        },
        options: {
          create: product.options.map((option, position) => ({
            name: option.name,
            position,
            values: {
              create: option.values.map((value, valuePosition) => ({ value, position: valuePosition })),
            },
          })),
        },
        images: {
          create: product.images.map((image, position) => ({
            sourceUrl: image.sourceUrl,
            url: image.url,
            altText: image.altText,
            position: image.position ?? position + 1,
            matchedBy: image.matchedBy as never,
            confidence: image.confidence,
          })),
        },
        tags: {
          create: product.tags.map((name) => ({ name })),
        },
      },
    });
  }
}
