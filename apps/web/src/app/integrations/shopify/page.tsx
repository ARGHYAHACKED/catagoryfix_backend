import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { ShoppingBag, CheckCircle2, ArrowRight, FileSpreadsheet } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Shopify CSV Integration & Product Data Pipeline | CatalogFix',
  description:
    'Map, clean, validate, and convert any supplier CSV file into 100% compliant Shopify CSV format ready for bulk store import.',
  path: '/integrations/shopify',
  keywords: ['shopify csv integration', 'shopify product import format', 'shopify csv schema pipeline'],
});

const faqs = [
  {
    question: 'Does CatalogFix output official Shopify CSV columns?',
    answer: 'Yes. All generated files strictly adhere to Shopify official product CSV specifications, including Handle, Title, Body (HTML), Vendor, Type, Tags, Published, Option1 Name, Option1 Value, SKU, Price, Compare At Price, and Image Src.',
  },
  {
    question: 'Can CatalogFix automatically split combined options into Option1, Option2, Option3?',
    answer: 'Yes. Our AI engine detects combined variant strings like "Red / XL" and splits them into distinct Option1 Name (Color) and Option2 Name (Size) columns required by Shopify.',
  },
];

export default function ShopifyIntegrationPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: 'Integrations', url: '/integrations' },
            { name: 'Shopify', url: '/integrations/shopify' },
          ]}
        />

        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Official Import Schema Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Shopify CSV Import Integration
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Turn raw supplier Excel workbooks and chaotic product feeds into zero-error Shopify CSV files ready for instant bulk import.
          </p>
          <div className="pt-4">
            <Link
              href="/shopify-csv-converter"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Convert CSV to Shopify Format</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="p-8 bg-white rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Supported Shopify CSV Fields</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Handle</strong>: Auto-slugified from title or SKU</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Title & Body HTML</strong>: Clean HTML formatting and tags</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Vendor & Type</strong>: Taxonomies and categories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Option1 / Option2 / Option3</strong>: Size, Color, Style variants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>SKU & Barcode</strong>: UPC/EAN validation & duplicate check</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Price & Compare At Price</strong>: Markup calculations & rounding</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Image Src & Position</strong>: Multi-image array parsing</span>
              </li>
            </ul>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Why Merchants Use CatalogFix for Shopify</h2>
            <div className="space-y-4 text-sm text-slate-600">
              <p>
                Shopify's CSV importer is strict. A single missing handle, duplicate SKU, or malformed variant header will cause the entire product batch to fail or corrupt store data.
              </p>
              <p>
                CatalogFix acts as an intelligent firewall between raw manufacturer data and your Shopify store, ensuring every column, variant row, and price decimal is verified before import.
              </p>
            </div>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Shopify CSV Converter',
              description: 'Convert supplier CSVs into Shopify-compatible files.',
              url: '/shopify-csv-converter',
              category: 'Tool',
            },
            {
              title: 'Shopify CSV Validator',
              description: 'Detect import errors before uploading to Shopify Admin.',
              url: '/shopify-csv-validator',
              category: 'Audit',
            },
            {
              title: 'Shopify Variant CSV',
              description: 'Learn how multi-option variants are structured in Shopify CSVs.',
              url: '/shopify-variant-csv',
              category: 'Guide',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
