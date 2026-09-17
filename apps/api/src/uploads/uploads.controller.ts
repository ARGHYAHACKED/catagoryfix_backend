import { Body, Controller, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { loadConfig } from '@catalogfix/config';
import { assertAllowedUpload, createStorageClient, ObjectStorage } from '@catalogfix/storage';
import { AuthGuard, type AuthUser } from '../common/auth.guard';
import { OrganizationGuard } from '../common/organization.guard';
import { prisma } from '@catalogfix/database';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';

@Controller('uploads')
@UseGuards(AuthGuard, OrganizationGuard)
export class UploadsController {
  @Post('presign')
  async presign(
    @Req() req: Request & { user?: AuthUser; organizationId?: string },
    @Body()
    body: {
      importId: string;
      fileName: string;
      mimeType: string;
      fileSize: number;
      type?: 'CATALOG' | 'IMAGE_ZIP' | 'OTHER';
    },
  ) {
    const config = loadConfig();
    assertAllowedUpload(body.fileName, body.mimeType, body.fileSize, config.MAX_UPLOAD_BYTES);
    const importJob = await prisma.importJob.findFirst({
      where: { id: body.importId, organizationId: req.organizationId, deletedAt: null },
    });
    if (!importJob) {
      throw new NotFoundException({ code: 'IMPORT_NOT_FOUND', message: 'Import could not be found.' });
    }
    const key = `org/${req.organizationId}/imports/${importJob.id}/${randomUUID()}-${body.fileName.replace(/[^\w.\-]+/g, '_')}`;
    const storage = new ObjectStorage(createStorageClient(config), config.R2_BUCKET);
    const uploadUrl = await storage.presignPut(key, body.mimeType);
    await prisma.importJob.update({
      where: { id: importJob.id },
      data: { status: 'UPLOADING' },
    });
    return {
      uploadUrl,
      storageKey: key,
      headers: { 'Content-Type': body.mimeType },
    };
  }
}
