export function normalizeBarcode(value: string | undefined): string | undefined {
  const barcode = (value ?? '').replace(/\s+/g, '');
  return barcode.length > 0 ? barcode : undefined;
}
