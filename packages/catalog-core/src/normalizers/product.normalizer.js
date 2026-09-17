"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappedRowToVariant = mappedRowToVariant;
const barcode_normalizer_1 = require("./barcode.normalizer");
const inventory_normalizer_1 = require("./inventory.normalizer");
const option_normalizer_1 = require("./option.normalizer");
const price_normalizer_1 = require("./price.normalizer");
const sku_normalizer_1 = require("./sku.normalizer");
const title_normalizer_1 = require("./title.normalizer");
function mappedRowToVariant(mapped) {
    const title = (0, title_normalizer_1.normalizeTitle)(mapped.title);
    const sku = (0, sku_normalizer_1.normalizeSku)(mapped.sku);
    const optionValues = {};
    const option1Name = (0, option_normalizer_1.normalizeOptionName)(mapped.option1Name, 'Option1');
    const option1Value = (0, option_normalizer_1.normalizeOptionValue)(mapped.option1Value);
    const option2Name = (0, option_normalizer_1.normalizeOptionName)(mapped.option2Name, 'Option2');
    const option2Value = (0, option_normalizer_1.normalizeOptionValue)(mapped.option2Value);
    const option3Name = (0, option_normalizer_1.normalizeOptionName)(mapped.option3Name, 'Option3');
    const option3Value = (0, option_normalizer_1.normalizeOptionValue)(mapped.option3Value);
    if (option1Name && option1Value) {
        optionValues[option1Name] = option1Value;
    }
    if (option2Name && option2Value) {
        optionValues[option2Name] = option2Value;
    }
    if (option3Name && option3Value) {
        optionValues[option3Name] = option3Value;
    }
    const groupingKey = (0, sku_normalizer_1.normalizeSku)(mapped.externalId) ||
        title.toLowerCase() ||
        sku ||
        JSON.stringify(mapped);
    const images = mapped.image
        ? [{ sourceUrl: mapped.image, url: mapped.image, position: 1 }]
        : [];
    return {
        groupingKey,
        title,
        product: {
            externalId: mapped.externalId || undefined,
            sku,
            barcode: (0, barcode_normalizer_1.normalizeBarcode)(mapped.barcode),
            title,
            handle: mapped.handle || (title ? (0, title_normalizer_1.slugifyHandle)(title) : undefined),
            description: mapped.description || undefined,
            descriptionHtml: mapped.description || undefined,
            vendor: mapped.vendor || undefined,
            productType: mapped.productType || undefined,
            price: (0, price_normalizer_1.normalizePrice)(mapped.price),
            compareAtPrice: (0, price_normalizer_1.normalizePrice)(mapped.compareAtPrice),
            cost: (0, price_normalizer_1.normalizePrice)(mapped.cost),
            currency: mapped.currency || 'USD',
            options: [],
            variants: [],
            images,
            tags: mapped.tags ? mapped.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
            seo: {
                title: mapped.seoTitle || undefined,
                description: mapped.seoDescription || undefined,
            },
            metadata: { raw: mapped },
        },
        variant: {
            sku,
            barcode: (0, barcode_normalizer_1.normalizeBarcode)(mapped.barcode),
            price: (0, price_normalizer_1.normalizePrice)(mapped.price),
            compareAtPrice: (0, price_normalizer_1.normalizePrice)(mapped.compareAtPrice),
            cost: (0, price_normalizer_1.normalizePrice)(mapped.cost),
            inventoryQuantity: (0, inventory_normalizer_1.normalizeInventory)(mapped.inventoryQuantity),
            optionValues,
            weight: (0, price_normalizer_1.normalizePrice)(mapped.weight),
            weightUnit: mapped.weightUnit || undefined,
            metadata: { raw: mapped },
        },
    };
}
//# sourceMappingURL=product.normalizer.js.map