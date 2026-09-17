export function normalizePrice(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const cleaned = value.replace(/[^0-9.,-]/g, '').replace(',', '.');
  const parsed = Number.parseFloat(cleaned);
  if (!Number.isFinite(parsed)) {
    return Number.NaN;
  }
  return Math.round(parsed * 100) / 100;
}
