import type { CatalogProduct } from '@catalogfix/catalog-core';

export const SHOPIFY_CSV_HEADERS = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Product Category',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Option2 Name',
  'Option2 Value',
  'Option3 Name',
  'Option3 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Variant Barcode',
  'Image Src',
  'Image Position',
  'Image Alt Text',
  'Gift Card',
  'SEO Title',
  'SEO Description',
  'Variant Weight Unit',
  'Cost per item',
  'Status',
] as const;

export function mapProductToShopifyRows(product: CatalogProduct): string[][] {
  const handle = product.handle || product.sku || 'product';
  const optionNames = product.options.slice(0, 3).map((option) => option.name);
  const variants = product.variants.length > 0 ? product.variants : [{ optionValues: {}, sku: product.sku, price: product.price }];
  const rows: string[][] = [];

  variants.forEach((variant, index) => {
    const optionValues = optionNames.map((name) => variant.optionValues[name] ?? '');
    const image = product.images[index] ?? (index === 0 ? product.images[0] : undefined);
    rows.push([
      handle,
      index === 0 ? product.title : '',
      index === 0 ? (product.descriptionHtml ?? product.description ?? '') : '',
      index === 0 ? (product.vendor ?? '') : '',
      '',
      index === 0 ? (product.productType ?? '') : '',
      index === 0 ? product.tags.join(', ') : '',
      'true',
      optionNames[0] ?? '',
      optionValues[0] ?? '',
      optionNames[1] ?? '',
      optionValues[1] ?? '',
      optionNames[2] ?? '',
      optionValues[2] ?? '',
      variant.sku ?? product.sku ?? '',
      variant.weight ? String(variant.weight) : '',
      'shopify',
      variant.inventoryQuantity !== undefined ? String(variant.inventoryQuantity) : '',
      'deny',
      'manual',
      variant.price !== undefined ? String(variant.price) : product.price !== undefined ? String(product.price) : '',
      variant.compareAtPrice !== undefined ? String(variant.compareAtPrice) : '',
      'true',
      'true',
      variant.barcode ?? product.barcode ?? '',
      image?.url ?? image?.sourceUrl ?? '',
      image ? String(image.position ?? index + 1) : '',
      image?.altText ?? '',
      'false',
      index === 0 ? (product.seo?.title ?? '') : '',
      index === 0 ? (product.seo?.description ?? '') : '',
      variant.weightUnit ?? '',
      variant.cost !== undefined ? String(variant.cost) : product.cost !== undefined ? String(product.cost) : '',
      'active',
    ]);
  });

  if (product.images.length > variants.length) {
    for (let i = variants.length; i < product.images.length; i += 1) {
      const image = product.images[i];
      if (!image) continue;
      rows.push([
        handle,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        image.url ?? image.sourceUrl ?? '',
        String(image.position ?? i + 1),
        image.altText ?? '',
        '',
        '',
        '',
        '',
        '',
        '',
      ]);
    }
  }

  return rows;
}
