export interface CatalogSeo {
  title?: string;
  description?: string;
}

export interface CatalogOption {
  name: string;
  values: string[];
}

export interface CatalogVariant {
  id?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  inventoryQuantity?: number;
  optionValues: Record<string, string>;
  weight?: number;
  weightUnit?: string;
  metadata?: Record<string, unknown>;
}

export interface CatalogImage {
  sourceUrl?: string;
  storageKey?: string;
  url?: string;
  altText?: string;
  position?: number;
  matchedBy?: string;
  confidence?: number;
}

export interface CatalogProduct {
  externalId?: string;
  sku?: string;
  barcode?: string;
  title: string;
  handle?: string;
  description?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  currency?: string;
  options: CatalogOption[];
  variants: CatalogVariant[];
  images: CatalogImage[];
  tags: string[];
  seo?: CatalogSeo;
  metadata?: Record<string, unknown>;
}

export interface ParsedRow {
  lineNumber: number;
  values: Record<string, string>;
}

export interface ParseResult {
  headers: string[];
  rows: ParsedRow[];
  encoding: string;
  delimiter: string;
  sheetName?: string;
  sheetNames?: string[];
}

export interface ColumnSuggestion {
  sourceColumn: string;
  targetField: string;
  confidence: number;
  sampleValues: string[];
}
