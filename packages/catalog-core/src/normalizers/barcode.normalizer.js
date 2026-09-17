"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBarcode = normalizeBarcode;
function normalizeBarcode(value) {
    const barcode = (value ?? '').replace(/\s+/g, '');
    return barcode.length > 0 ? barcode : undefined;
}
//# sourceMappingURL=barcode.normalizer.js.map