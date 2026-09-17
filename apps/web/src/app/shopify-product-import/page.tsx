import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Shopify Product Import Tool | Import CSV Products Cleanly',
  description:
    'Import products into Shopify using automated CSV data cleaning, variant mapping, and image formatting.',
  path: '/shopify-product-import',
  keywords: [
    'shopify product import',
    'import products into shopify',
    'shopify import products csv',
    'shopify bulk import',
  ],
});

const faqs = [
  {
    question: 'How do I import products into Shopify using CSV?',
    answer: 'Go to Shopify Admin > Products > Import. Drag and drop your converted CatalogFix CSV file. Check "Overwrite any current products that have the same handle" if updating existing items.',
  },
];

export default function ShopifyProductImportPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Shopify Product Import', url: '/shopify-product-import' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            Store Migration & Onboarding
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Shopify Product Import Formatting Pipeline
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Prepare, validate, and convert any product catalog into an import-ready Shopify CSV feed in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Format Product Import Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Shopify CSV Converter',
              description: 'Convert supplier CSV spreadsheets into Shopify import schema.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
            {
              title: 'Bulk Shopify Product Upload',
              description: 'Upload 10,000+ SKU catalogs to Shopify.',
              url: '/bulk-shopify-product-upload',
              category: 'Upload',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
