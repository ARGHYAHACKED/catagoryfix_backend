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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXlsx = parseXlsx;
const XLSX = __importStar(require("xlsx"));
const header_detector_1 = require("../detectors/header.detector");
function parseXlsx(buffer, sheetName) {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: false, raw: false });
    const sheetNames = workbook.SheetNames;
    const selected = sheetName && sheetNames.includes(sheetName) ? sheetName : sheetNames[0];
    if (!selected) {
        return { headers: [], rows: [], encoding: 'binary', delimiter: ',', sheetNames };
    }
    const sheet = workbook.Sheets[selected];
    if (!sheet) {
        return { headers: [], rows: [], encoding: 'binary', delimiter: ',', sheetName: selected, sheetNames };
    }
    const matrix = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        raw: false,
        blankrows: false,
    });
    if (matrix.length === 0) {
        return { headers: [], rows: [], encoding: 'binary', delimiter: ',', sheetName: selected, sheetNames };
    }
    const headers = (0, header_detector_1.detectHeaders)((matrix[0] ?? []).map((cell) => String(cell ?? '')));
    const rows = matrix.slice(1).map((row, index) => {
        const values = {};
        headers.forEach((header, col) => {
            values[header] = String(row[col] ?? '').trim();
        });
        return { lineNumber: index + 2, values };
    });
    return {
        headers,
        rows,
        encoding: 'binary',
        delimiter: ',',
        sheetName: selected,
        sheetNames,
    };
}
//# sourceMappingURL=xlsx.parser.js.map