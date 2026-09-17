"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCatalogBuffer = parseCatalogBuffer;
const csv_parser_1 = require("./csv.parser");
const xlsx_parser_1 = require("./xlsx.parser");
function parseCatalogBuffer(buffer, originalName, mimeType, sheetName) {
    const lower = originalName.toLowerCase();
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || mimeType.includes('spreadsheet')) {
        return (0, xlsx_parser_1.parseXlsx)(buffer, sheetName);
    }
    return (0, csv_parser_1.parseCsv)(buffer);
}
//# sourceMappingURL=index.js.map