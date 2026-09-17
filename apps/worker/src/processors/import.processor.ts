import type { Job } from 'bullmq';
import { prisma } from '@catalogfix/database';
import { detectColumns, parseCatalogBuffer } from '@catalogfix/catalog-core';
import { createStorageClient, ObjectStorage } from '@catalogfix/storage';
import { loadConfig } from '@catalogfix/config';
import { createLogger } from '@catalogfix/logger';
import type { ImportJobPayload } from '@catalogfix/queue';

const logger = createLogger('worker');

export async function processImportJob(job: Job<ImportJobPayload>): Promise<void> {
  const { importId, organizationId } = job.data;
  const importJob = await prisma.importJob.findFirst({
    where: { id: importId, organizationId, deletedAt: null },
    include: { files: true, mappings: true },
  });
  if (!importJob) {
    return;
  }
  if (['PROCESSING', 'READY', 'COMPLETED'].includes(importJob.status) && job.data.stage === 'parse-headers') {
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
    data: { status: 'PARSING', currentStage: 'Detecting columns', progressPercentage: 10 },
  });

  const config = loadConfig();
  const storage = new ObjectStorage(createStorageClient(config), config.R2_BUCKET);
  const buffer = await storage.getBuffer(catalogFile.storageKey);
  const parsed = parseCatalogBuffer(buffer, catalogFile.originalName, catalogFile.mimeType, importJob.selectedSheet ?? undefined);
  const sampleRows = parsed.rows.slice(0, 8).map((row) => row.values);
  const suggestions = detectColumns(parsed.headers, sampleRows);

  await prisma.$transaction(async (tx) => {
    await tx.importJob.update({
      where: { id: importId },
      data: {
        status: 'MAPPING_REQUIRED',
        currentStage: 'Waiting for column mapping',
        progressPercentage: 25,
        totalRows: parsed.rows.length,
        detectedHeaders: parsed.headers,
        detectedEncoding: parsed.encoding,
        detectedDelimiter: parsed.delimiter,
        selectedSheet: parsed.sheetName,
        sampleRows,
      },
    });
    if (importJob.mappings.length === 0) {
      await tx.columnMapping.createMany({
        data: suggestions.map((suggestion) => ({
          importId,
          sourceColumn: suggestion.sourceColumn,
          targetField: suggestion.targetField,
          confidence: suggestion.confidence,
          autoDetected: true,
          confirmedByUser: false,
        })),
      });
    }
  });

  logger.info({ jobId: job.id, importId, organizationId, headers: parsed.headers.length }, 'Parsed catalog headers');
}
