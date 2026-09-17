import { type MappingDict } from './mapping/column-mapper';
import type { CatalogProduct, ParsedRow } from './types';
export declare function rowsToCatalog(rows: ParsedRow[], mapping: MappingDict): CatalogProduct[];
export { parseCatalogBuffer } from './parsers/index';
export { parseCsv } from './parsers/csv.parser';
export { parseXlsx } from './parsers/xlsx.parser';
export { detectColumns } from './mapping/column-detector';
export { applyColumnMapping } from './mapping/column-mapper';
export { scoreColumn } from './mapping/mapping-confidence';
export { detectDelimiter } from './detectors/delimiter.detector';
export { detectEncoding } from './detectors/encoding.detector';
export * from './types';
//# sourceMappingURL=index.d.ts.map