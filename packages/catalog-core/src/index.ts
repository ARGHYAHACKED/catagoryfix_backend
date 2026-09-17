import { applyColumnMapping, type MappingDict } from './mapping/column-mapper';
import { mappedRowToVariant } from './normalizers/product.normalizer';
import { groupVariants } from './grouping/variant-grouper';
import type { CatalogProduct, ParsedRow } from './types';

export function rowsToCatalog(rows: ParsedRow[], mapping: MappingDict): CatalogProduct[] {
  const items = rows.map((row) => {
    const mapped = applyColumnMapping(row, mapping);
    const result = mappedRowToVariant(mapped);
    return {
      groupingKey: result.groupingKey,
      product: {
        ...result.product,
        options: [],
        variants: [],
      },
      variant: result.variant,
    };
  });
  return groupVariants(items);
}

export { parseCatalogBuffer } from './parsers/index';
export { parseCsv } from './parsers/csv.parser';
export { parseXlsx } from './parsers/xlsx.parser';
export { detectColumns } from './mapping/column-detector';
export { applyColumnMapping } from './mapping/column-mapper';
export { scoreColumn } from './mapping/mapping-confidence';
export { detectDelimiter } from './detectors/delimiter.detector';
export { detectEncoding } from './detectors/encoding.detector';
export * from './types';
