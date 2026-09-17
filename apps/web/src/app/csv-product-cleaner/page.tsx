import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'CSV Product Cleaner | Fix & Format Product CSV Files',
  description:
    'Clean product CSV spreadsheets. Fix character encoding, strip illegal line breaks, validate headers, and format price columns.',
  path: '/csv-product-cleaner',
  keywords: [
    'csv product cleaner',
    'clean product csv',
    'product csv formatting',
    'catalog csv cleanup',
  ],
});

const faqs = [
  {
    question: 'How does CSV Product Cleaner handle special characters and accents?',
    answer: 'CatalogFix automatically re-encodes raw files into UTF-8 standard encoding, preserving currency symbols, accents, and international product attributes.',
  },
];

export default function CsvProductCleanerPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'CSV Product Cleaner', url: '/csv-product-cleaner' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            CSV Syntax & Formatting Cleanup
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Fix & Clean Product CSV Files Online
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Sanitize quotes, repair line breaks, re-encode UTF-8 headers, and clean messy product spreadsheet rows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Clean CSV File Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Shopify CSV Converter',
              description: 'Convert cleaned CSV files directly to Shopify format.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
            {
              title: 'Shopify CSV Validator',
              description: 'Validate CSV files for import syntax errors.',
              url: '/shopify-csv-validator',
              category: 'Audit',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
