"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectColumns = detectColumns;
const mapping_confidence_1 = require("./mapping-confidence");
function detectColumns(headers, sampleRows) {
    return headers.map((sourceColumn) => {
        const scored = (0, mapping_confidence_1.scoreColumn)(sourceColumn);
        const targetField = scored.field === 'color'
            ? 'option1Value'
            : scored.field === 'size'
                ? 'option2Value'
                : scored.field;
        const sampleValues = sampleRows
            .map((row) => row[sourceColumn] ?? '')
            .filter((value) => value.length > 0)
            .slice(0, 5);
        return {
            sourceColumn,
            targetField: scored.confidence >= 0.40 ? targetField : 'ignore',
            confidence: scored.confidence,
            sampleValues,
        };
    });
}
//# sourceMappingURL=column-detector.js.map