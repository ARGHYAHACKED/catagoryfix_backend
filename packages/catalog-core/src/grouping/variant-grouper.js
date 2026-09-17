"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupVariants = groupVariants;
function groupVariants(items) {
    const groups = new Map();
    for (const item of items) {
        const existing = groups.get(item.groupingKey);
        if (!existing) {
            groups.set(item.groupingKey, {
                product: { ...item.product, variants: [], options: [] },
                variants: [item.variant],
            });
        }
        else {
            existing.variants.push(item.variant);
            if ((!existing.product.images || existing.product.images.length === 0) && item.product.images.length > 0) {
                existing.product.images = item.product.images;
            }
        }
    }
    return [...groups.values()].map(({ product, variants }) => {
        const optionNames = new Set();
        for (const variant of variants) {
            Object.keys(variant.optionValues).forEach((name) => optionNames.add(name));
        }
        const options = [...optionNames].map((name) => ({
            name,
            values: [
                ...new Set(variants
                    .map((variant) => variant.optionValues[name])
                    .filter((value) => Boolean(value))),
            ],
        }));
        const first = variants[0];
        return {
            ...product,
            sku: product.sku ?? first?.sku,
            price: product.price ?? first?.price,
            options,
            variants,
        };
    });
}
//# sourceMappingURL=variant-grouper.js.map