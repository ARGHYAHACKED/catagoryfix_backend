"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectHeaders = detectHeaders;
function detectHeaders(headers) {
    return headers.map((header, index) => {
        const trimmed = header.trim();
        return trimmed.length > 0 ? trimmed : `Column ${index + 1}`;
    });
}
//# sourceMappingURL=header.detector.js.map