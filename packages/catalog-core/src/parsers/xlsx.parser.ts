import * as XLSX from 'xlsx';
import { detectHeaders } from '../detectors/header.detector';
import type { ParseResult, ParsedRow } from '../types';

export function parseXlsx(buffer: Buffer, sheetName?: string): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false, raw: false });
  const sheetNames = workbook.SheetNames;
  const selected = sheetName && sheetNames.includes(sheetName) ? sheetName : sheetNames[0];
  if (!selected) {
    return { headers: [], rows: [], encoding: 'binary', delimiter: ',', sheetNames };
  }
  const sheet = workbook.Sheets[selected];
  if (!sheet) {
    return { headers: [], rows: [], encoding: 'binary', delimiter: ',', sheetName: selected, sheetNames };
  }
  const matrix = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1,
    defval: '',
    raw: false,
    blankrows: false,
  });
  if (matrix.length === 0) {
    return { headers: [], rows: [], encoding: 'binary', delimiter: ',', sheetName: selected, sheetNames };
  }
  const headers = detectHeaders((matrix[0] ?? []).map((cell) => String(cell ?? '')));
  const rows: ParsedRow[] = matrix.slice(1).map((row, index) => {
    const values: Record<string, string> = {};
    headers.forEach((header, col) => {
      values[header] = String(row[col] ?? '').trim();
    });
    return { lineNumber: index + 2, values };
  });
  return {
    headers,
    rows,
    encoding: 'binary',
    delimiter: ',',
    sheetName: selected,
    sheetNames,
  };
}
