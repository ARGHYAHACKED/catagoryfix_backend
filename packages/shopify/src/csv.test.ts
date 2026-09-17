import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCsvCell, toCsv } from './index';

test('escapes formula cells', () => {
  assert.equal(sanitizeCsvCell('=1+1'), "'=1+1");
  assert.equal(sanitizeCsvCell('+2'), "'+2");
  assert.equal(sanitizeCsvCell('-2'), "'-2");
  assert.equal(sanitizeCsvCell('@SUM(1)'), "'@SUM(1)");
  assert.equal(sanitizeCsvCell('Classic Tee'), 'Classic Tee');
});

test('csv quotes commas', () => {
  const csv = toCsv([['Handle', 'Title'], ['tee', 'Red, Large']]);
  assert.match(csv, /"Red, Large"/);
});
