import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Product Catalog Cleaner | E-commerce Data Cleaning Tool',
  description:
    'Clean messy product catalog spreadsheets automatically. Strip HTML tags, remove duplicate SKUs, standardize titles, and normalize pricing across feeds.',
  path: '/product-catalog-cleaner',
  keywords: [
    'product catalog cleaner',
    'catalog data cleanup',
    'ecommerce catalog cleanup',
    'product data cleaning',
  ],
});

const faqs = [
  {
    question: 'What types of catalog errors can CatalogFix clean automatically?',
    answer: 'CatalogFix strips broken HTML, standardizes title capitalization, removes invalid special characters, deduplicates SKUs, rounds price decimals, and normalizes category taxonomies.',
  },
];

export default function ProductCatalogCleanerPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Product Catalog Cleaner', url: '/product-catalog-cleaner' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            Automated Catalog Normalization
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            E-Commerce Product Catalog Cleaner
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Clean, validate, and normalize messy catalog spreadsheets from multi-vendor feeds automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Clean Catalog Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Product Feed Cleaner',
              description: 'Clean inventory feeds from external dropshippers.',
              url: '/product-feed-cleaner',
              category: 'Feed Cleanup',
            },
            {
              title: 'CSV Product Cleaner',
              description: 'Fix formatting errors in standalone CSV files.',
              url: '/csv-product-cleaner',
              category: 'Formatting',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
