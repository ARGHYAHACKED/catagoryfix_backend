import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { RefreshCw, ArrowRight } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Product Feed Cleaner | Supplier & Ecommerce Feed Tool',
  description:
    'Clean, filter, and transform product feeds from suppliers and dropship vendors before uploading to your store.',
  path: '/product-feed-cleaner',
  keywords: [
    'product feed cleaner',
    'product feed cleanup',
    'supplier feed cleanup',
    'ecommerce product feed tool',
  ],
});

const faqs = [
  {
    question: 'How often can I clean supplier product feeds?',
    answer: 'CatalogFix supports daily and weekly automated feed transformation pipelines so your store inventory is always synced.',
  },
];

export default function ProductFeedCleanerPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Product Feed Cleaner', url: '/product-feed-cleaner' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            Feed Transformation Engine
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Supplier & Ecommerce Product Feed Cleaner
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Clean, filter out of stock items, apply price markup rules, and output clean CSV feeds automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Clean Product Feed Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Product Catalog Cleaner',
              description: 'Clean catalog spreadsheets and titles.',
              url: '/product-catalog-cleaner',
              category: 'Cleanup',
            },
            {
              title: 'Supplier CSV to Shopify',
              description: 'Map dropship manufacturer feeds to Shopify.',
              url: '/supplier-csv-to-shopify',
              category: 'Use Case',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
