import { normalizeBarcode } from './barcode.normalizer';
import { normalizeInventory } from './inventory.normalizer';
import { normalizeOptionName, normalizeOptionValue } from './option.normalizer';
import { normalizePrice } from './price.normalizer';
import { normalizeSku } from './sku.normalizer';
import { normalizeTitle, slugifyHandle } from './title.normalizer';
import type { CatalogProduct, CatalogVariant } from '../types';

export function mappedRowToVariant(mapped: Record<string, string>): {
  groupingKey: string;
  title: string;
  product: CatalogProduct;
  variant: CatalogVariant;
} {
  const title = normalizeTitle(mapped.title);
  const sku = normalizeSku(mapped.sku);
  const optionValues: Record<string, string> = {};
  const option1Name = normalizeOptionName(mapped.option1Name, 'Option1');
  const option1Value = normalizeOptionValue(mapped.option1Value);
  const option2Name = normalizeOptionName(mapped.option2Name, 'Option2');
  const option2Value = normalizeOptionValue(mapped.option2Value);
  const option3Name = normalizeOptionName(mapped.option3Name, 'Option3');
  const option3Value = normalizeOptionValue(mapped.option3Value);
  if (option1Name && option1Value) {
    optionValues[option1Name] = option1Value;
  }
  if (option2Name && option2Value) {
    optionValues[option2Name] = option2Value;
  }
  if (option3Name && option3Value) {
    optionValues[option3Name] = option3Value;
  }

  const groupingKey =
    normalizeSku(mapped.externalId) ||
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
      barcode: normalizeBarcode(mapped.barcode),
      title,
      handle: mapped.handle || (title ? slugifyHandle(title) : undefined),
      description: mapped.description || undefined,
      descriptionHtml: mapped.description || undefined,
      vendor: mapped.vendor || undefined,
      productType: mapped.productType || undefined,
      price: normalizePrice(mapped.price),
      compareAtPrice: normalizePrice(mapped.compareAtPrice),
      cost: normalizePrice(mapped.cost),
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
      barcode: normalizeBarcode(mapped.barcode),
      price: normalizePrice(mapped.price),
      compareAtPrice: normalizePrice(mapped.compareAtPrice),
      cost: normalizePrice(mapped.cost),
      inventoryQuantity: normalizeInventory(mapped.inventoryQuantity),
      optionValues,
      weight: normalizePrice(mapped.weight),
      weightUnit: mapped.weightUnit || undefined,
      metadata: { raw: mapped },
    },
  };
}
