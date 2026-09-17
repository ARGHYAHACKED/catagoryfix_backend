export function normalizeSku(value: string | undefined): string | undefined {
  const sku = (value ?? '').trim();
  return sku.length > 0 ? sku : undefined;
}
