"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyColumnMapping = applyColumnMapping;
function applyColumnMapping(row, mapping) {
    const mapped = {};
    for (const [source, target] of Object.entries(mapping)) {
        if (!target || target === 'ignore') {
            continue;
        }
        const value = row.values[source] ?? '';
        if (target === 'option1Value' && !mapped.option1Name) {
            mapped.option1Name = mapped.option1Name ?? 'Color';
        }
        if (target === 'option2Value' && !mapped.option2Name) {
            mapped.option2Name = mapped.option2Name ?? 'Size';
        }
        mapped[target] = value;
    }
    return mapped;
}
//# sourceMappingURL=column-mapper.js.map