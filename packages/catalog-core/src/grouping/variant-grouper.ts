import type { CatalogOption, CatalogProduct, CatalogVariant } from '../types';

export function groupVariants(items: Array<{ groupingKey: string; product: CatalogProduct; variant: CatalogVariant }>): CatalogProduct[] {
  const groups = new Map<string, { product: CatalogProduct; variants: CatalogVariant[] }>();
  for (const item of items) {
    const existing = groups.get(item.groupingKey);
    if (!existing) {
      groups.set(item.groupingKey, {
        product: { ...item.product, variants: [], options: [] },
        variants: [item.variant],
      });
    } else {
      existing.variants.push(item.variant);
      if ((!existing.product.images || existing.product.images.length === 0) && item.product.images.length > 0) {
        existing.product.images = item.product.images;
      }
    }
  }

  return [...groups.values()].map(({ product, variants }) => {
    const optionNames = new Set<string>();
    for (const variant of variants) {
      Object.keys(variant.optionValues).forEach((name) => optionNames.add(name));
    }
    const options: CatalogOption[] = [...optionNames].map((name) => ({
      name,
      values: [
        ...new Set(
          variants
            .map((variant) => variant.optionValues[name])
            .filter((value): value is string => Boolean(value)),
        ),
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
