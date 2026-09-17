"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSku = normalizeSku;
function normalizeSku(value) {
    const sku = (value ?? '').trim();
    return sku.length > 0 ? sku : undefined;
}
//# sourceMappingURL=sku.normalizer.js.map