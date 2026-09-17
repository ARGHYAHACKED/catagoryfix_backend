import type { Job } from 'bullmq';
import type { CatalogProduct } from '@catalogfix/catalog-core';
import { prisma } from '@catalogfix/database';
import { ShopifyCsvExporter } from '@catalogfix/shopify';
import { createStorageClient, ObjectStorage, checksumBuffer } from '@catalogfix/storage';
import { loadConfig } from '@catalogfix/config';
import type { ExportJobPayload } from '@catalogfix/queue';

export async function processExportJob(job: Job<ExportJobPayload>): Promise<void> {
  const { exportId, organizationId } = job.data;
  const exportJob = await prisma.exportJob.findFirst({
    where: { id: exportId, organizationId },
    include: { import: { include: { products: { include: { variants: true, images: true, tags: true, options: { include: { values: true } } } } } } },
  });
  if (!exportJob?.import) {
    await prisma.exportJob.update({
      where: { id: exportId },
      data: { status: 'FAILED', errorMessage: 'Import not found for export.' },
    });
    return;
  }
  if (exportJob.status === 'COMPLETED') {
    return;
  }

  await prisma.exportJob.update({
    where: { id: exportId },
    data: { status: 'PROCESSING', startedAt: new Date() },
  });

  const products: CatalogProduct[] = exportJob.import.products.map((product) => ({
    sku: product.sku ?? undefined,
    barcode: product.barcode ?? undefined,
    title: product.title,
    handle: product.handle ?? undefined,
    description: product.description ?? undefined,
    descriptionHtml: product.descriptionHtml ?? undefined,
    vendor: product.vendor ?? undefined,
    productType: product.productType ?? undefined,
    price: product.price ? Number(product.price) : undefined,
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    cost: product.cost ? Number(product.cost) : undefined,
    options: product.options.map((option) => ({
      name: option.name,
      values: option.values.map((value) => value.value),
    })),
    variants: product.variants.map((variant) => ({
      sku: variant.sku ?? undefined,
      barcode: variant.barcode ?? undefined,
      price: variant.price ? Number(variant.price) : undefined,
      compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : undefined,
      cost: variant.cost ? Number(variant.cost) : undefined,
      inventoryQuantity: variant.inventoryQuantity ?? undefined,
      optionValues: (variant.optionValues as Record<string, string>) ?? {},
      weight: variant.weight ? Number(variant.weight) : undefined,
      weightUnit: variant.weightUnit ?? undefined,
    })),
    images: product.images.map((image) => ({
      sourceUrl: image.sourceUrl ?? undefined,
      url: image.url ?? undefined,
      altText: image.altText ?? undefined,
      position: image.position,
    })),
    tags: product.tags.map((tag) => tag.name),
    seo: { title: product.seoTitle ?? undefined, description: product.seoDescription ?? undefined },
  }));

  const exporter = new ShopifyCsvExporter();
  const result = await exporter.export(products, { filename: `shopify-${exportJob.import.name}.csv` });
  const config = loadConfig();
  const key = `org/${organizationId}/exports/${exportId}/${result.fileName}`;
  const storage = new ObjectStorage(createStorageClient(config), config.R2_BUCKET);
  await storage.putBuffer(key, result.buffer, result.mimeType);
  await prisma.exportFile.create({
    data: {
      exportId,
      storageKey: key,
      fileName: result.fileName,
      mimeType: result.mimeType,
      fileSize: result.buffer.length,
      checksum: checksumBuffer(result.buffer),
    },
  });
  await prisma.exportJob.update({
    where: { id: exportId },
    data: {
      status: 'COMPLETED',
      processedProducts: products.length,
      completedAt: new Date(),
    },
  });
  await prisma.product.updateMany({
    where: { importId: exportJob.importId ?? undefined, status: 'READY' },
    data: { status: 'EXPORTED' },
  });
}
