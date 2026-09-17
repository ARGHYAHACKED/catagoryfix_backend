import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalog } from './index';
import type { CatalogProduct } from '@catalogfix/catalog-core';

const base = (): CatalogProduct => ({
  title: 'Hat',
  sku: 'HAT-1',
  options: [],
  variants: [{ sku: 'HAT-1', optionValues: {}, price: 10 }],
  images: [{ url: 'https://example.com/hat.jpg' }],
  tags: [],
});

test('flags missing title and duplicate sku', () => {
  const products: CatalogProduct[] = [
    { ...base(), title: '', sku: 'DUP' },
    { ...base(), sku: 'DUP' },
  ];
  const issues = validateCatalog(products);
  assert.ok(issues.some((i) => i.code === 'PRODUCT_MISSING_TITLE'));
  assert.ok(issues.some((i) => i.code === 'DUPLICATE_SKU'));
});
