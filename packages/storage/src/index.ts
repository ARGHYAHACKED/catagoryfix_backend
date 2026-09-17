import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { AppConfig } from '@catalogfix/config';
import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';

const ALLOWED_EXTENSIONS = new Set(['.csv', '.xlsx', '.xls', '.zip']);
const ALLOWED_MIME = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
]);

export function createStorageClient(config: AppConfig): S3Client {
  return new S3Client({
    region: config.R2_REGION,
    endpoint: config.R2_ENDPOINT,
    forcePathStyle: config.R2_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY,
    },
  });
}

export class ObjectStorage {
  constructor(
    private readonly client: S3Client,
    private readonly bucket: string,
  ) {}

  async presignPut(key: string, contentType: string, expiresIn = 900): Promise<string> {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn },
    );
  }

  async presignGet(key: string, expiresIn = 900): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn },
    );
  }

  async putBuffer(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async getBuffer(key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    const stream = response.Body;
    if (!stream) {
      throw new Error('Empty object body');
    }
    const bytes = await stream.transformToByteArray();
    return Buffer.from(bytes);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}

export function assertAllowedUpload(fileName: string, mimeType: string, fileSize: number, maxBytes: number): void {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw Object.assign(new Error('File extension is not allowed.'), { code: 'INVALID_FILE_TYPE' });
  }
  if (!ALLOWED_MIME.has(mimeType)) {
    throw Object.assign(new Error('MIME type is not allowed.'), { code: 'INVALID_MIME_TYPE' });
  }
  if (fileSize <= 0 || fileSize > maxBytes) {
    throw Object.assign(new Error('File size is not allowed.'), { code: 'INVALID_FILE_SIZE' });
  }
}

export function checksumBuffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

export function asNodeReadable(body: unknown): Readable {
  if (body instanceof Readable) {
    return body;
  }
  throw new Error('Unsupported body type');
}
