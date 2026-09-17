export function normalizeOptionName(value: string | undefined, fallback: string): string | undefined {
  const name = (value ?? '').trim();
  if (name.length > 0) {
    return name;
  }
  return fallback;
}

export function normalizeOptionValue(value: string | undefined): string | undefined {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : undefined;
}
