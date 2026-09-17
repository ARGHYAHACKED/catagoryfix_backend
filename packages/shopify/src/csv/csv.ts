const FORMULA_PREFIX = /^(?:=|\+|-|@|\t|\r)/;

export function sanitizeCsvCell(value: string): string {
  if (FORMULA_PREFIX.test(value)) {
    return `'${value}`;
  }
  return value;
}

export function toCsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const sanitized = sanitizeCsvCell(cell ?? '');
          if (/[",\n]/.test(sanitized)) {
            return `"${sanitized.replace(/"/g, '""')}"`;
          }
          return sanitized;
        })
        .join(','),
    )
    .join('\n');
}
