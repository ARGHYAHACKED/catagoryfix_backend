import type { ParsedRow } from '../types';

export type MappingDict = Record<string, string>;

export function applyColumnMapping(
  row: ParsedRow,
  mapping: MappingDict,
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [source, target] of Object.entries(mapping)) {
    if (!target || target === 'ignore') {
      continue;
    }
    const value = row.values[source] ?? '';
    if (target === 'option1Value' && !mapped.option1Name) {
      mapped.option1Name = mapped.option1Name ?? 'Color';
    }
    if (target === 'option2Value' && !mapped.option2Name) {
      mapped.option2Name = mapped.option2Name ?? 'Size';
    }
    mapped[target] = value;
  }
  return mapped;
}
