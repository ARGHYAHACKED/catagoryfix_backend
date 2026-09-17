"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectEncoding = detectEncoding;
exports.decodeBuffer = decodeBuffer;
function detectEncoding(buffer) {
    if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
        return 'utf-8';
    }
    if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
        return 'utf-16le';
    }
    if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
        return 'utf-16be';
    }
    return 'utf-8';
}
function decodeBuffer(buffer, encoding) {
    if (encoding === 'utf-16le') {
        return buffer.toString('utf16le');
    }
    return buffer.toString('utf8');
}
//# sourceMappingURL=encoding.detector.js.map