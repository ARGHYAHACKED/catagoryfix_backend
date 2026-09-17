"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTitle = normalizeTitle;
exports.slugifyHandle = slugifyHandle;
function normalizeTitle(value) {
    return (value ?? '').replace(/\s+/g, ' ').trim();
}
function slugifyHandle(title) {
    return title
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}
//# sourceMappingURL=title.normalizer.js.map