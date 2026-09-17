import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { FileSpreadsheet, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Excel to Shopify Converter | XLSX to Shopify Product CSV',
  description:
    'Convert Microsoft Excel (.xlsx, .xls) supplier spreadsheets into Shopify-ready product CSV files automatically.',
  path: '/excel-to-shopify',
  keywords: [
    'excel to shopify',
    'convert excel to shopify csv',
    'xlsx to shopify',
    'shopify excel import',
  ],
});

const faqs = [
  {
    question: 'Can Shopify import raw Excel files (.xlsx) directly?',
    answer: 'No. Shopify Admin requires UTF-8 encoded CSV files. CatalogFix converts native Excel workbooks into compliant Shopify CSV files instantly.',
  },
];

export default function ExcelToShopifyPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Excel to Shopify', url: '/excel-to-shopify' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
            Native Excel (.xlsx) Parser
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Convert Excel (.xlsx) Spreadsheets to Shopify Product CSV
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Upload multi-sheet Excel files from suppliers and output a clean, UTF-8 formatted Shopify product CSV.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Convert Excel File Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <RelatedPages
          links={[
            {
              title: 'Shopify CSV Converter',
              description: 'Convert CSV spreadsheets to Shopify format.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
            {
              title: 'Supplier CSV to Shopify',
              description: 'Transform dropship manufacturer spreadsheets.',
              url: '/supplier-csv-to-shopify',
              category: 'Use Case',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
