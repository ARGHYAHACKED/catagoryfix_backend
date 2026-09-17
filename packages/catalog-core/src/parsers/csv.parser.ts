import Papa from 'papaparse';
import { detectDelimiter } from '../detectors/delimiter.detector';
import { decodeBuffer, detectEncoding } from '../detectors/encoding.detector';
import { detectHeaders } from '../detectors/header.detector';
import type { ParseResult, ParsedRow } from '../types';

export function parseCsv(buffer: Buffer): ParseResult {
  const encoding = detectEncoding(buffer);
  const text = decodeBuffer(buffer, encoding).replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(text.slice(0, 4096));
  const parsed = Papa.parse<string[]>(text, {
    delimiter,
    skipEmptyLines: 'greedy',
  });
  const rawRows = parsed.data.filter((row) => row.some((cell) => String(cell).trim().length > 0));
  if (rawRows.length === 0) {
    return { headers: [], rows: [], encoding, delimiter };
  }
  const headers = detectHeaders((rawRows[0] ?? []).map((cell) => String(cell)));
  const rows: ParsedRow[] = rawRows.slice(1).map((row, index) => {
    const values: Record<string, string> = {};
    headers.forEach((header, col) => {
      values[header] = String(row[col] ?? '').trim();
    });
    return { lineNumber: index + 2, values };
  });
  return { headers, rows, encoding, delimiter };
}
