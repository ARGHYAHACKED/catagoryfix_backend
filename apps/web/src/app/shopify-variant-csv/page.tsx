import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Shopify Variant CSV Formatting Guide & Generator',
  description:
    'Format multi-option product variants in Shopify CSV files correctly. Map Size, Color, and Material options across parent/child rows.',
  path: '/shopify-variant-csv',
  keywords: [
    'shopify variant csv',
    'shopify variants csv format',
    'shopify product variant import',
    'shopify variant csv example',
  ],
});

const faqs = [
  {
    question: 'How are product variants structured in Shopify CSV files?',
    answer: 'In Shopify CSVs, all variants of a product share the exact same Handle value. The first row contains product details (Title, Body HTML, Vendor, Tags) plus Option1/Option2 values. Subsequent variant rows leave Title/Body blank and specify their unique Option values, SKUs, and Prices.',
  },
];

export default function ShopifyVariantCsvPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Shopify Variant CSV', url: '/shopify-variant-csv' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            Multi-Option Matrix Formatting
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Shopify Variant CSV Formatting & Generator
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Group separate supplier rows or split combined variant strings into official Shopify Option1, Option2, and Option3 columns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Format Variant CSV Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Shopify CSV Converter',
              description: 'Convert raw supplier CSVs into Shopify-compatible files.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
            {
              title: 'Shopify CSV Validator',
              description: 'Check variant option consistency before upload.',
              url: '/shopify-csv-validator',
              category: 'Audit',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
