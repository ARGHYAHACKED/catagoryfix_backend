import type { CatalogProduct } from '@catalogfix/catalog-core';
import type { PlatformValidationResult } from '@catalogfix/platform-core';

export function validateShopifyProducts(products: CatalogProduct[]): PlatformValidationResult {
  const issues = products.flatMap((product) => {
    const local = [];
    if (!product.title.trim()) {
      local.push({
        sku: product.sku,
        field: 'title',
        code: 'SHOPIFY_TITLE_REQUIRED',
        message: 'Shopify requires a product title.',
        severity: 'ERROR' as const,
      });
    }
    if (product.options.length > 3) {
      local.push({
        sku: product.sku,
        field: 'options',
        code: 'SHOPIFY_OPTION_LIMIT',
        message: 'Shopify CSV supports a maximum of 3 options.',
        severity: 'ERROR' as const,
      });
    }
    return local;
  });
  return { valid: issues.every((issue) => issue.severity !== 'ERROR'), issues };
}
