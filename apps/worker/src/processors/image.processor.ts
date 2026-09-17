import type { Job } from 'bullmq';
import { prisma } from '@catalogfix/database';
import { createStorageClient, ObjectStorage } from '@catalogfix/storage';
import { loadConfig } from '@catalogfix/config';
import { createLogger } from '@catalogfix/logger';
import type { ImageJobPayload } from '@catalogfix/queue';
import path from 'node:path';
import unzipper from 'unzipper';

const logger = createLogger('worker');
const ALLOWED_IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const MAX_EXTRACTED = 500 * 1024 * 1024;

function normalizeSkuFromFilename(filename: string): string {
  return path
    .basename(filename, path.extname(filename))
    .replace(/[-_](\d+|front|back|main|alt)$/i, '')
    .toUpperCase();
}

export async function processImageJob(job: Job<ImageJobPayload>): Promise<void> {
  const { importId, organizationId, fileId } = job.data;
  const file = await prisma.importFile.findFirst({
    where: { id: fileId, import: { id: importId, organizationId } },
  });
  if (!file) {
    return;
  }
  const config = loadConfig();
  const storage = new ObjectStorage(createStorageClient(config), config.R2_BUCKET);
  const zipBuffer = await storage.getBuffer(file.storageKey);
  const directory = await unzipper.Open.buffer(zipBuffer);
  let extracted = 0;
  const products = await prisma.product.findMany({ where: { importId }, select: { id: true, sku: true } });
  const bySku = new Map(products.filter((p) => p.sku).map((p) => [p.sku!.toUpperCase(), p]));

  for (const entry of directory.files) {
    if (entry.type !== 'File') continue;
    const name = entry.path.replace(/\\/g, '/');
    if (name.includes('..') || path.isAbsolute(name)) {
      throw new Error('Zip slip detected');
    }
    const ext = path.extname(name).toLowerCase();
    if (!ALLOWED_IMAGE_EXT.has(ext)) {
      continue;
    }
    const content = await entry.buffer();
    extracted += content.length;
    if (extracted > MAX_EXTRACTED) {
      throw new Error('Extracted zip exceeds size limit');
    }
    const sku = normalizeSkuFromFilename(name);
    const product = bySku.get(sku);
    if (!product) {
      continue;
    }
    const key = `org/${organizationId}/imports/${importId}/images/${path.basename(name)}`;
    await storage.putBuffer(key, content, `image/${ext.replace('.', '')}`);
    await prisma.productImage.create({
      data: {
        productId: product.id,
        storageKey: key,
        url: key,
        altText: product.sku ?? undefined,
        matchedBy: 'FILENAME',
        confidence: 0.9,
      },
    });
  }
  logger.info({ jobId: job.id, importId, extracted }, 'Processed image zip');
}
