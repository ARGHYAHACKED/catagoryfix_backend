"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreColumn = scoreColumn;
const SYNONYMS = {
    title: ['product name', 'name', 'title', 'item name', 'product title', 'supplier item name', 'item title', 'product_title'],
    sku: ['sku', 'variant sku', 'item sku', 'product sku', 'sku number', 'sku code', 'item number', 'item no', 'item #', 'style number', 'mpn', 'code', 'variant_sku'],
    barcode: ['barcode', 'variant barcode', 'ean', 'upc', 'gtin', 'isbn', 'upc barcode', 'variant_barcode'],
    externalId: ['supplier id', 'supplierid', 'id', 'product id', 'item id', 'supplier item id', 'external id'],
    price: ['retail', 'retail price', 'price', 'selling price', 'msrp', 'unit price', 'variant price', 'variant_price'],
    compareAtPrice: ['compare at', 'compare-at price', 'variant compare at price', 'list price', 'was price', 'original price', 'compare price', 'compare at price', 'variant_compare_at_price'],
    cost: ['cost', 'cost per item', 'item cost', 'wholesale', 'cost price', 'unit cost', 'wholesale cost', 'whsl_cost_usd'],
    vendor: ['brand', 'brand name', 'vendor', 'manufacturer', 'supplier'],
    productType: ['category', 'product type', 'type', 'collection', 'product_type'],
    description: ['description', 'long description', 'product description', 'details', 'body html'],
    color: ['color', 'colour', 'color name', 'colour_val'],
    size: ['size', 'sizes'],
    option1Name: ['option1 name', 'option 1 name', 'option1name', 'option 1', 'option1_name', 'first option name'],
    option1Value: ['option1 value', 'option 1 value', 'option1value', 'option1_value', 'first option value'],
    option2Name: ['option2 name', 'option 2 name', 'option2name', 'option 2', 'option2_name', 'second option name'],
    option2Value: ['option2 value', 'option 2 value', 'option2value', 'option2_value', 'second option value'],
    option3Name: ['option3 name', 'option 3 name', 'option3name', 'option 3', 'option3_name', 'third option name'],
    option3Value: ['option3 value', 'option 3 value', 'option3value', 'option3_value', 'third option value'],
    image: ['image', 'photo', 'image url', 'image link', 'picture', 'image src', 'img_src_link_1', 'image_src'],
    imagePosition: ['image position', 'photo position', 'image_position', 'img position'],
    imageAlt: ['image alt text', 'image alt', 'photo alt', 'image_alt_text', 'alt text'],
    inventoryQuantity: [
        'inventory',
        'qty',
        'quantity',
        'stock',
        'stock quantity',
        'stock level',
        'variant inventory qty',
        'variant inventory quantity',
        'variant qty',
        'variant_inventory_qty',
        'qty_avail',
        'inventory_qty',
    ],
    inventoryTracker: [
        'inventory tracker',
        'variant inventory tracker',
        'inventory_tracker',
        'variant_inventory_tracker',
        'tracker',
    ],
    inventoryPolicy: [
        'inventory policy',
        'variant inventory policy',
        'inventory_policy',
        'variant_inventory_policy',
    ],
    fulfillmentService: [
        'fulfillment service',
        'variant fulfillment service',
        'fulfillment_service',
        'variant_fulfillment_service',
    ],
    requiresShipping: [
        'requires shipping',
        'variant requires shipping',
        'requires_shipping',
        'variant_requires_shipping',
    ],
    taxable: ['taxable', 'variant taxable', 'variant_taxable'],
    tags: ['tags', 'keywords'],
    handle: ['handle', 'slug', 'url handle'],
    weight: ['weight', 'variant weight', 'weight in grams', 'grams'],
    weightUnit: ['weight unit', 'weight_unit', 'variant weight unit', 'variant_weight_unit'],
    variantGrams: ['variant grams', 'grams', 'variant_grams', 'weight grams'],
    giftCard: ['gift card', 'is gift card', 'gift_card'],
    seoTitle: ['seo title', 'meta title', 'seo_title'],
    seoDescription: ['seo description', 'meta description', 'seo_description'],
    status: ['status', 'product status', 'active'],
};
function normalizeHeader(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function scoreColumn(header) {
    const normalized = normalizeHeader(header);
    let bestField = 'ignore';
    let bestScore = 0;
    for (const [field, names] of Object.entries(SYNONYMS)) {
        for (const name of names) {
            const normName = normalizeHeader(name);
            // Exact match gets top score
            if (normalized === normName) {
                return { field, confidence: 0.98 };
            }
            // Exact phrase contained in header or vice-versa
            if (normalized.includes(normName) || normName.includes(normalized)) {
                // Calculate overlap quality
                const minLen = Math.min(normName.length, normalized.length);
                const maxLen = Math.max(normName.length, normalized.length);
                const ratio = minLen / maxLen;
                // If the phrase is a strong key match (e.g. "variant inventory qty" containing "inventory qty"), give high confidence
                const score = Math.max(0.85, 0.98 * ratio);
                if (score > bestScore) {
                    bestScore = score;
                    bestField = field;
                }
            }
        }
    }
    return { field: bestField, confidence: bestField === 'ignore' ? 0 : Math.round(bestScore * 100) / 100 };
}
//# sourceMappingURL=mapping-confidence.js.map