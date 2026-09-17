"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectEncoding = exports.detectDelimiter = exports.scoreColumn = exports.applyColumnMapping = exports.detectColumns = exports.parseXlsx = exports.parseCsv = exports.parseCatalogBuffer = void 0;
exports.rowsToCatalog = rowsToCatalog;
const column_mapper_1 = require("./mapping/column-mapper");
const product_normalizer_1 = require("./normalizers/product.normalizer");
const variant_grouper_1 = require("./grouping/variant-grouper");
function rowsToCatalog(rows, mapping) {
    const items = rows.map((row) => {
        const mapped = (0, column_mapper_1.applyColumnMapping)(row, mapping);
        const result = (0, product_normalizer_1.mappedRowToVariant)(mapped);
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
    return (0, variant_grouper_1.groupVariants)(items);
}
var index_1 = require("./parsers/index");
Object.defineProperty(exports, "parseCatalogBuffer", { enumerable: true, get: function () { return index_1.parseCatalogBuffer; } });
var csv_parser_1 = require("./parsers/csv.parser");
Object.defineProperty(exports, "parseCsv", { enumerable: true, get: function () { return csv_parser_1.parseCsv; } });
var xlsx_parser_1 = require("./parsers/xlsx.parser");
Object.defineProperty(exports, "parseXlsx", { enumerable: true, get: function () { return xlsx_parser_1.parseXlsx; } });
var column_detector_1 = require("./mapping/column-detector");
Object.defineProperty(exports, "detectColumns", { enumerable: true, get: function () { return column_detector_1.detectColumns; } });
var column_mapper_2 = require("./mapping/column-mapper");
Object.defineProperty(exports, "applyColumnMapping", { enumerable: true, get: function () { return column_mapper_2.applyColumnMapping; } });
var mapping_confidence_1 = require("./mapping/mapping-confidence");
Object.defineProperty(exports, "scoreColumn", { enumerable: true, get: function () { return mapping_confidence_1.scoreColumn; } });
var delimiter_detector_1 = require("./detectors/delimiter.detector");
Object.defineProperty(exports, "detectDelimiter", { enumerable: true, get: function () { return delimiter_detector_1.detectDelimiter; } });
var encoding_detector_1 = require("./detectors/encoding.detector");
Object.defineProperty(exports, "detectEncoding", { enumerable: true, get: function () { return encoding_detector_1.detectEncoding; } });
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map