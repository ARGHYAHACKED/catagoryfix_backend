"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeInventory = normalizeInventory;
function normalizeInventory(value) {
    if (value === undefined || value.trim() === '') {
        return undefined;
    }
    const parsed = Number.parseInt(value.replace(/[^0-9-]/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
}
//# sourceMappingURL=inventory.normalizer.js.map