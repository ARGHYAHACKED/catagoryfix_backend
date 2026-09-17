export function normalizeTitle(value: string | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

export function slugifyHandle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}
