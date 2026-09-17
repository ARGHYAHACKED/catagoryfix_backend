export function normalizeInventory(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }
  const parsed = Number.parseInt(value.replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
