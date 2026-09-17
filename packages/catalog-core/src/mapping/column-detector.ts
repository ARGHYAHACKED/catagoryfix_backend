import { scoreColumn } from './mapping-confidence';
import type { ColumnSuggestion } from '../types';

export function detectColumns(
  headers: string[],
  sampleRows: Record<string, string>[],
): ColumnSuggestion[] {
  return headers.map((sourceColumn) => {
    const scored = scoreColumn(sourceColumn);
    const targetField =
      scored.field === 'color'
        ? 'option1Value'
        : scored.field === 'size'
          ? 'option2Value'
          : scored.field;
    const sampleValues = sampleRows
      .map((row) => row[sourceColumn] ?? '')
      .filter((value) => value.length > 0)
      .slice(0, 5);
    return {
      sourceColumn,
      targetField: scored.confidence >= 0.40 ? targetField : 'ignore',
      confidence: scored.confidence,
      sampleValues,
    };
  });
}
