import type { CatalogProduct } from '@catalogfix/catalog-core';

export interface ExportOptions {
  filename?: string;
}

export interface PlatformValidationIssue {
  sku?: string;
  field: string;
  code: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface PlatformValidationResult {
  valid: boolean;
  issues: PlatformValidationIssue[];
}

export interface ExportResult {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}

export interface PublishResult {
  published: number;
  failed: number;
  errors: string[];
}

export interface PlatformExporter {
  platform: string;
  validate(products: CatalogProduct[]): Promise<PlatformValidationResult>;
  export(products: CatalogProduct[], options?: ExportOptions): Promise<ExportResult>;
}

export interface CommerceIntegration {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publishProducts(products: CatalogProduct[]): Promise<PublishResult>;
  updateProducts(products: CatalogProduct[]): Promise<PublishResult>;
}
