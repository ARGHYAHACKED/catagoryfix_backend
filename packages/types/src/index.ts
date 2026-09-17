export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
  requestId: string;
};

export type PaginationQuery = {
  cursor?: string;
  limit?: number;
};

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};

export const CATALOG_TARGET_FIELDS = [
  'ignore',
  'externalId',
  'sku',
  'barcode',
  'title',
  'handle',
  'description',
  'vendor',
  'productType',
  'price',
  'compareAtPrice',
  'cost',
  'currency',
  'inventoryQuantity',
  'inventoryTracker',
  'inventoryPolicy',
  'fulfillmentService',
  'requiresShipping',
  'taxable',
  'option1Name',
  'option1Value',
  'option2Name',
  'option2Value',
  'option3Name',
  'option3Value',
  'image',
  'imagePosition',
  'imageAlt',
  'tags',
  'weight',
  'weightUnit',
  'variantGrams',
  'giftCard',
  'seoTitle',
  'seoDescription',
  'status',
] as const;

export type CatalogTargetField = (typeof CATALOG_TARGET_FIELDS)[number];
