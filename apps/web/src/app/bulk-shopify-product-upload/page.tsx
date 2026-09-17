import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Layers, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Bulk Shopify Product Upload Tool | Import Large Product Catalogs',
  description:
    'Upload tens of thousands of products to Shopify cleanly. Split large CSV files, format bulk variants, and bypass Shopify import limits.',
  path: '/bulk-shopify-product-upload',
  keywords: [
    'bulk shopify product upload',
    'upload products to shopify in bulk',
    'shopify bulk product import',
    'bulk upload shopify csv',
  ],
});

const faqs = [
  {
    question: 'How many products can I upload in bulk to Shopify at once?',
    answer: 'Shopify Admin allows up to 15MB file size per CSV upload. CatalogFix automatically splits massive multi-gigabyte supplier files into chunked 10MB CSV batches.',
  },
];

export default function BulkShopifyProductUploadPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Bulk Shopify Upload', url: '/bulk-shopify-product-upload' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            High-Volume Catalog Pipeline
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Bulk Shopify Product Upload & File Splitter
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Prepare, clean, and batch-import 10,000+ SKU catalogs into Shopify without timeout errors or system freezes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Start Bulk Upload Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Shopify CSV Converter',
              description: 'Convert supplier CSV files into Shopify import schema.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
            {
              title: 'Excel to Shopify',
              description: 'Import XLSX workbooks directly into Shopify.',
              url: '/excel-to-shopify',
              category: 'Converter',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
