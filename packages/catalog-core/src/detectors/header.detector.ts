export function detectHeaders(headers: string[]): string[] {
  return headers.map((header, index) => {
    const trimmed = header.trim();
    return trimmed.length > 0 ? trimmed : `Column ${index + 1}`;
  });
}
