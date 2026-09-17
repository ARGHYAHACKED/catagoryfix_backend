import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv, detectColumns, rowsToCatalog } from './index';

const fixtures = join(__dirname, '../../../fixtures');

test('parses simple products and maps columns', () => {
  const buffer = readFileSync(join(fixtures, 'simple-products.csv'));
  const parsed = parseCsv(buffer);
  assert.ok(parsed.headers.includes('Product Name'));
  const suggestions = detectColumns(parsed.headers, parsed.rows.slice(0, 3).map((r) => r.values));
  const title = suggestions.find((s) => s.sourceColumn === 'Product Name');
  assert.equal(title?.targetField, 'title');
  const mapping: Record<string, string> = {};
  for (const s of suggestions) mapping[s.sourceColumn] = s.targetField;
  const products = rowsToCatalog(parsed.rows, mapping);
  assert.equal(products.length, 2);
  const tee = products.find((p) => p.title === 'Classic Tee');
  assert.ok(tee);
  assert.equal(tee?.variants.length, 3);
});

test('detects missing titles in mapped rows', () => {
  const buffer = readFileSync(join(fixtures, 'missing-fields.csv'));
  const parsed = parseCsv(buffer);
  const suggestions = detectColumns(parsed.headers, parsed.rows.map((r) => r.values));
  const mapping: Record<string, string> = {};
  for (const s of suggestions) mapping[s.sourceColumn] = s.targetField;
  const products = rowsToCatalog(parsed.rows, mapping);
  assert.ok(products.some((p) => p.title.length === 0));
});
