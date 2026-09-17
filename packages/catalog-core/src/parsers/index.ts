import { parseCsv } from './csv.parser';
import { parseXlsx } from './xlsx.parser';
import type { ParseResult } from '../types';

export function parseCatalogBuffer(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  sheetName?: string,
): ParseResult {
  const lower = originalName.toLowerCase();
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || mimeType.includes('spreadsheet')) {
    return parseXlsx(buffer, sheetName);
  }
  return parseCsv(buffer);
}
