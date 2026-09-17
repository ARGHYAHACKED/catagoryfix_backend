"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDelimiter = detectDelimiter;
function detectDelimiter(sample) {
    const candidates = [',', ';', '\t', '|'];
    const firstLine = sample.split(/\r?\n/).find((line) => line.trim().length > 0) ?? '';
    let best = ',';
    let bestCount = -1;
    for (const delimiter of candidates) {
        const count = firstLine.split(delimiter).length;
        if (count > bestCount) {
            bestCount = count;
            best = delimiter;
        }
    }
    return best;
}
//# sourceMappingURL=delimiter.detector.js.map