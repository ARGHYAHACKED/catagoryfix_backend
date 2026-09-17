"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = parseCsv;
const papaparse_1 = __importDefault(require("papaparse"));
const delimiter_detector_1 = require("../detectors/delimiter.detector");
const encoding_detector_1 = require("../detectors/encoding.detector");
const header_detector_1 = require("../detectors/header.detector");
function parseCsv(buffer) {
    const encoding = (0, encoding_detector_1.detectEncoding)(buffer);
    const text = (0, encoding_detector_1.decodeBuffer)(buffer, encoding).replace(/^\uFEFF/, '');
    const delimiter = (0, delimiter_detector_1.detectDelimiter)(text.slice(0, 4096));
    const parsed = papaparse_1.default.parse(text, {
        delimiter,
        skipEmptyLines: 'greedy',
    });
    const rawRows = parsed.data.filter((row) => row.some((cell) => String(cell).trim().length > 0));
    if (rawRows.length === 0) {
        return { headers: [], rows: [], encoding, delimiter };
    }
    const headers = (0, header_detector_1.detectHeaders)((rawRows[0] ?? []).map((cell) => String(cell)));
    const rows = rawRows.slice(1).map((row, index) => {
        const values = {};
        headers.forEach((header, col) => {
            values[header] = String(row[col] ?? '').trim();
        });
        return { lineNumber: index + 2, values };
    });
    return { headers, rows, encoding, delimiter };
}
//# sourceMappingURL=csv.parser.js.map