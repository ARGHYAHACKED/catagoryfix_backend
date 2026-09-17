import type { CatalogProduct } from '@catalogfix/catalog-core';
import type {
  CommerceIntegration,
  ExportOptions,
  ExportResult,
  PlatformExporter,
  PlatformValidationResult,
  PublishResult,
} from '@catalogfix/platform-core';
import { toCsv } from './csv/csv';
import { mapProductToShopifyRows, SHOPIFY_CSV_HEADERS } from './mapper/product.mapper';
import { validateShopifyProducts } from './validators/shopify.validator';

export class ShopifyCsvExporter implements PlatformExporter {
  platform = 'SHOPIFY';

  async validate(products: CatalogProduct[]): Promise<PlatformValidationResult> {
    return validateShopifyProducts(products);
  }

  async export(products: CatalogProduct[], options?: ExportOptions): Promise<ExportResult> {
    const rows = [Array.from(SHOPIFY_CSV_HEADERS), ...products.flatMap((product) => mapProductToShopifyRows(product))];
    const csv = toCsv(rows);
    return {
      fileName: options?.filename ?? 'shopify-products.csv',
      mimeType: 'text/csv; charset=utf-8',
      buffer: Buffer.from(csv, 'utf8'),
    };
  }
}

export class ShopifyCommerceIntegration implements CommerceIntegration {
  async connect(): Promise<void> {
    throw new Error('Direct Shopify OAuth is not enabled in V1.');
  }

  async disconnect(): Promise<void> {
    throw new Error('Direct Shopify OAuth is not enabled in V1.');
  }

  async publishProducts(_products: CatalogProduct[]): Promise<PublishResult> {
    throw new Error('Direct Shopify publishing is not enabled in V1.');
  }

  async updateProducts(_products: CatalogProduct[]): Promise<PublishResult> {
    throw new Error('Direct Shopify publishing is not enabled in V1.');
  }
}

export { sanitizeCsvCell, toCsv } from './csv/csv';
export { mapProductToShopifyRows } from './mapper/product.mapper';
