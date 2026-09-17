"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptionName = normalizeOptionName;
exports.normalizeOptionValue = normalizeOptionValue;
function normalizeOptionName(value, fallback) {
    const name = (value ?? '').trim();
    if (name.length > 0) {
        return name;
    }
    return fallback;
}
function normalizeOptionValue(value) {
    const v = (value ?? '').trim();
    return v.length > 0 ? v : undefined;
}
//# sourceMappingURL=option.normalizer.js.map