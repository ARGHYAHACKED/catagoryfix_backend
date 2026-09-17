import type { Job } from 'bullmq';
import type { CatalogProduct } from '@catalogfix/catalog-core';
import { prisma, AuditEvent } from '@catalogfix/database';
import { validateCatalog } from '@catalogfix/validation';
import type { ImportJobPayload } from '@catalogfix/queue';

export async function processValidationJob(job: Job<ImportJobPayload>): Promise<void> {
  const { importId, organizationId } = job.data;
  const products = await prisma.product.findMany({
    where: { importId, deletedAt: null },
    include: { variants: true, images: true, tags: true, options: { include: { values: true } } },
  });
  const catalog: CatalogProduct[] = products.map((product) => ({
    externalId: product.externalId ?? undefined,
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
      id: variant.id,
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

  const issues = validateCatalog(catalog);
  await prisma.validationIssue.deleteMany({ where: { importId } });
  if (issues.length > 0) {
    await prisma.validationIssue.createMany({
      data: issues.map((issue) => {
        const product = products[issue.productIndex];
        const variant = issue.variantIndex !== undefined ? product?.variants[issue.variantIndex] : undefined;
        return {
          importId,
          productId: product?.id,
          variantId: variant?.id,
          field: issue.field,
          code: issue.code,
          message: issue.message,
          severity: issue.severity,
        };
      }),
    });
  }

  const errorProductIds = new Set(
    issues.filter((issue) => issue.severity === 'ERROR').map((issue) => products[issue.productIndex]?.id),
  );
  await Promise.all(
    products.map((product) =>
      prisma.product.update({
        where: { id: product.id },
        data: { status: errorProductIds.has(product.id) ? 'INVALID' : 'READY' },
      }),
    ),
  );

  const errorCount = issues.filter((issue) => issue.severity === 'ERROR').length;
  const warningCount = issues.filter((issue) => issue.severity === 'WARNING').length;
  await prisma.importJob.update({
    where: { id: importId },
    data: {
      status: 'READY',
      currentStage: 'Ready',
      progressPercentage: 100,
      failedRows: errorCount,
      warningRows: warningCount,
      completedAt: new Date(),
    },
  });
  await prisma.auditLog.create({
    data: {
      organizationId,
      event: AuditEvent.IMPORT_COMPLETED,
      metadata: { importId, errors: errorCount, warnings: warningCount },
    },
  });
}
