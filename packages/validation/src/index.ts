import type { CatalogProduct } from '@catalogfix/catalog-core';

export type IssueSeverity = 'INFO' | 'WARNING' | 'ERROR';

export interface CatalogIssue {
  productIndex: number;
  variantIndex?: number;
  field: string;
  code: string;
  message: string;
  severity: IssueSeverity;
}

export interface ValidationContext {
  skuCounts: Map<string, number>;
  barcodeCounts: Map<string, number>;
  handleCounts: Map<string, number>;
}

export interface CatalogRule {
  code: string;
  run(products: CatalogProduct[], context: ValidationContext): CatalogIssue[];
}

function isValidNumber(value: number | undefined): boolean {
  return value === undefined || Number.isFinite(value);
}

function collectContext(products: CatalogProduct[]): ValidationContext {
  const skuCounts = new Map<string, number>();
  const barcodeCounts = new Map<string, number>();
  const handleCounts = new Map<string, number>();
  for (const product of products) {
    if (product.handle) {
      handleCounts.set(product.handle, (handleCounts.get(product.handle) ?? 0) + 1);
    }
    const productSkus = new Set<string>();
    if (product.sku) productSkus.add(product.sku);
    for (const variant of product.variants) {
      if (variant.sku) productSkus.add(variant.sku);
    }
    for (const sku of productSkus) {
      skuCounts.set(sku, (skuCounts.get(sku) ?? 0) + 1);
    }
    const productBarcodes = new Set<string>();
    if (product.barcode) productBarcodes.add(product.barcode);
    for (const variant of product.variants) {
      if (variant.barcode) productBarcodes.add(variant.barcode);
    }
    for (const barcode of productBarcodes) {
      barcodeCounts.set(barcode, (barcodeCounts.get(barcode) ?? 0) + 1);
    }
  }
  return { skuCounts, barcodeCounts, handleCounts };
}

const rules: CatalogRule[] = [
  {
    code: 'PRODUCT_MISSING_TITLE',
    run(products) {
      return products.flatMap((product, productIndex) =>
        product.title.trim().length === 0
          ? [
              {
                productIndex,
                field: 'title',
                code: 'PRODUCT_MISSING_TITLE',
                message: 'Product title is missing.',
                severity: 'ERROR' as const,
              },
            ]
          : [],
      );
    },
  },
  {
    code: 'PRODUCT_MISSING_SKU',
    run(products) {
      return products.flatMap((product, productIndex) => {
        const issues: CatalogIssue[] = [];
        if (!product.sku && product.variants.every((variant) => !variant.sku)) {
          issues.push({
            productIndex,
            field: 'sku',
            code: 'PRODUCT_MISSING_SKU',
            message: 'Product is missing a SKU.',
            severity: 'ERROR',
          });
        }
        return issues;
      });
    },
  },
  {
    code: 'DUPLICATE_SKU',
    run(products, context) {
      return products.flatMap((product, productIndex) => {
        const issues: CatalogIssue[] = [];
        if (product.sku && (context.skuCounts.get(product.sku) ?? 0) > 1) {
          issues.push({
            productIndex,
            field: 'sku',
            code: 'DUPLICATE_SKU',
            message: `SKU ${product.sku} is duplicated across products.`,
            severity: 'ERROR',
          });
        }
        product.variants.forEach((variant, variantIndex) => {
          if (
            variant.sku &&
            variant.sku !== product.sku &&
            (context.skuCounts.get(variant.sku) ?? 0) > 1
          ) {
            issues.push({
              productIndex,
              variantIndex,
              field: 'sku',
              code: 'DUPLICATE_SKU',
              message: `SKU ${variant.sku} is duplicated across products.`,
              severity: 'ERROR',
            });
          }
        });
        return issues;
      });
    },
  },
  {
    code: 'INVALID_PRICE',
    run(products) {
      return products.flatMap((product, productIndex) => {
        const issues: CatalogIssue[] = [];
        if (product.price !== undefined && !isValidNumber(product.price)) {
          issues.push({
            productIndex,
            field: 'price',
            code: 'INVALID_PRICE',
            message: 'Price is not a valid number.',
            severity: 'ERROR',
          });
        }
        if (product.price !== undefined && product.price < 0) {
          issues.push({
            productIndex,
            field: 'price',
            code: 'NEGATIVE_PRICE',
            message: 'Price cannot be negative.',
            severity: 'ERROR',
          });
        }
        if (
          product.compareAtPrice !== undefined &&
          product.price !== undefined &&
          isValidNumber(product.compareAtPrice) &&
          isValidNumber(product.price) &&
          product.compareAtPrice < product.price
        ) {
          issues.push({
            productIndex,
            field: 'compareAtPrice',
            code: 'INVALID_COMPARE_AT_PRICE',
            message: 'Compare-at price is lower than price.',
            severity: 'WARNING',
          });
        }
        return issues;
      });
    },
  },
  {
    code: 'INVALID_INVENTORY',
    run(products) {
      return products.flatMap((product, productIndex) =>
        product.variants.flatMap((variant, variantIndex) => {
          if (variant.inventoryQuantity !== undefined && !Number.isFinite(variant.inventoryQuantity)) {
            return [
              {
                productIndex,
                variantIndex,
                field: 'inventoryQuantity',
                code: 'INVALID_INVENTORY',
                message: 'Inventory quantity is invalid.',
                severity: 'ERROR' as const,
              },
            ];
          }
          return [];
        }),
      );
    },
  },
  {
    code: 'INVALID_BARCODE',
    run(products, context) {
      return products.flatMap((product, productIndex) => {
        const issues: CatalogIssue[] = [];
        if (product.barcode && !/^[0-9]{8,14}$/.test(product.barcode)) {
          issues.push({
            productIndex,
            field: 'barcode',
            code: 'INVALID_BARCODE',
            message: 'Barcode must be 8-14 digits.',
            severity: 'WARNING',
          });
        }
        if (product.barcode && (context.barcodeCounts.get(product.barcode) ?? 0) > 1) {
          issues.push({
            productIndex,
            field: 'barcode',
            code: 'DUPLICATE_BARCODE',
            message: `Barcode ${product.barcode} is duplicated.`,
            severity: 'WARNING',
          });
        }
        return issues;
      });
    },
  },
  {
    code: 'IMAGE_NOT_FOUND',
    run(products) {
      return products.flatMap((product, productIndex) => {
        if (product.images.length === 0) {
          return [
            {
              productIndex,
              field: 'images',
              code: 'IMAGE_NOT_FOUND',
              message: 'Product has no image.',
              severity: 'WARNING' as const,
            },
          ];
        }
        return product.images.flatMap((image) => {
          const url = image.sourceUrl ?? image.url;
          if (url && !/^https?:\/\//i.test(url) && !url.includes('/')) {
            return [];
          }
          if (url && url.length > 0 && !/^https?:\/\//i.test(url) && !url.startsWith('/')) {
            return [
              {
                productIndex,
                field: 'images',
                code: 'INVALID_IMAGE_URL',
                message: 'Image URL is invalid.',
                severity: 'WARNING' as const,
              },
            ];
          }
          return [];
        });
      });
    },
  },
  {
    code: 'EMPTY_DESCRIPTION',
    run(products) {
      return products.flatMap((product, productIndex) =>
        !product.description || product.description.trim().length === 0
          ? [
              {
                productIndex,
                field: 'description',
                code: 'EMPTY_DESCRIPTION',
                message: 'Description is empty.',
                severity: 'WARNING' as const,
              },
            ]
          : [],
      );
    },
  },
  {
    code: 'DUPLICATE_HANDLE',
    run(products, context) {
      return products.flatMap((product, productIndex) =>
        product.handle && (context.handleCounts.get(product.handle) ?? 0) > 1
          ? [
              {
                productIndex,
                field: 'handle',
                code: 'DUPLICATE_HANDLE',
                message: `Handle ${product.handle} is duplicated.`,
                severity: 'WARNING' as const,
              },
            ]
          : [],
      );
    },
  },
  {
    code: 'OVERSIZED_SEO',
    run(products) {
      return products.flatMap((product, productIndex) => {
        const issues: CatalogIssue[] = [];
        if (product.seo?.title && product.seo.title.length > 70) {
          issues.push({
            productIndex,
            field: 'seoTitle',
            code: 'OVERSIZED_SEO_TITLE',
            message: 'SEO title exceeds 70 characters.',
            severity: 'WARNING',
          });
        }
        if (product.seo?.description && product.seo.description.length > 320) {
          issues.push({
            productIndex,
            field: 'seoDescription',
            code: 'OVERSIZED_SEO_DESCRIPTION',
            message: 'SEO description exceeds 320 characters.',
            severity: 'WARNING',
          });
        }
        return issues;
      });
    },
  },
  {
    code: 'UNSUPPORTED_HTML',
    run(products) {
      return products.flatMap((product, productIndex) => {
        const html = product.descriptionHtml ?? '';
        if (/<(script|iframe|object|embed)\b/i.test(html) || /on\w+=/i.test(html) || /javascript:/i.test(html)) {
          return [
            {
              productIndex,
              field: 'descriptionHtml',
              code: 'UNSUPPORTED_HTML',
              message: 'Description contains unsafe HTML.',
              severity: 'WARNING' as const,
            },
          ];
        }
        return [];
      });
    },
  },
  {
    code: 'INVALID_WEIGHT',
    run(products) {
      const units = new Set(['g', 'kg', 'kgs', 'lb', 'lbs', 'oz', 'ozs', 'grams', 'pounds', 'ounces']);
      return products.flatMap((product, productIndex) =>
        product.variants.flatMap((variant, variantIndex) => {
          const issues: CatalogIssue[] = [];
          if (variant.weight !== undefined && (!Number.isFinite(variant.weight) || variant.weight < 0)) {
            issues.push({
              productIndex,
              variantIndex,
              field: 'weight',
              code: 'INVALID_WEIGHT',
              message: 'Weight is invalid.',
              severity: 'WARNING',
            });
          }
          if (variant.weightUnit && !units.has(variant.weightUnit.toLowerCase())) {
            issues.push({
              productIndex,
              variantIndex,
              field: 'weightUnit',
              code: 'INVALID_WEIGHT_UNIT',
              message: 'Weight unit is not recognized.',
              severity: 'INFO',
            });
          }
          return issues;
        }),
      );
    },
  },
];

export function validateCatalog(products: CatalogProduct[]): CatalogIssue[] {
  const context = collectContext(products);
  return rules.flatMap((rule) => rule.run(products, context));
}

export { rules as catalogRules };
