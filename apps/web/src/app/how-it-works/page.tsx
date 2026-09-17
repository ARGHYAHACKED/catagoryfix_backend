import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { FileUp, Wand2, CheckCircle2, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'How CatalogFix Works | Automated Supplier CSV to Shopify Pipeline',
  description:
    'Learn how CatalogFix ingests raw supplier spreadsheets, cleans column headers, normalizes product variants, validates SKUs, and exports store-ready Shopify CSV files in 4 steps.',
  path: '/how-it-works',
  keywords: ['how catalogfix works', 'supplier csv pipeline', 'shopify csv automation step by step'],
});

const faqs = [
  {
    question: 'How long does it take to clean a 10,000 row catalog?',
    answer: 'CatalogFix processes up to 50,000 product rows in under 30 seconds using background worker instances.',
  },
  {
    question: 'Do I need to clean supplier CSV files manually beforehand?',
    answer: 'No. You can upload completely raw XLSX, CSV, or TSV files directly from manufacturers or dropshippers.',
  },
  {
    question: 'Can I reuse column mappings for future inventory updates?',
    answer: 'Yes. Once mapped, save your custom preset to apply it instantly to weekly or monthly supplier updates.',
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'How It Works', url: '/how-it-works' }]} />

        {/* Hero */}
        <div className="text-center py-12 max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Step-by-Step Data Pipeline
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How CatalogFix Cleans Messy Supplier Catalogs
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From raw, unstructured manufacturer spreadsheets to store-ready Shopify CSV feeds in 4 automated steps.
          </p>
        </div>

        {/* 4 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
              1
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-indigo-600" />
              <span>Upload Supplier Spreadsheet</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Drag and drop any raw supplier CSV, Excel (.xlsx), or TSV file. CatalogFix automatically parses encoding, handles multi-sheet workbooks, and detects header rows.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
              Supported: CSV, XLSX, TSV, XML feeds up to 100MB
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
              2
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-600" />
              <span>AI Column & Field Mapping</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Our AI engine matches arbitrary supplier column names (e.g. "Item#", "Wholesale Cost", "Description_HTML") directly to official Shopify CSV fields.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
              Automatic mapping for Handle, Title, Body HTML, Vendor, Type, Tags, SKU, Price
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
              3
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>Validation & Variant Normalization</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Validate SKUs for duplicates, normalize multi-option product variants (Size, Color, Material), apply pricing multipliers, and strip broken characters.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
              Flags 15+ common import errors before you upload to Shopify
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
              4
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              <span>Export Shopify-Ready CSV</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Download a 100% compliant Shopify CSV file ready for instant bulk import via Shopify Admin or matrix update tools.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
              Zero import rejection guarantees on valid schemas
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="my-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-5 bg-white rounded-xl border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Pages */}
        <RelatedPages
          links={[
            {
              title: 'Shopify CSV Converter',
              description: 'Convert any CSV or Excel file directly into Shopify product format.',
              url: '/shopify-csv-converter',
              category: 'Core Tool',
            },
            {
              title: 'Supplier CSV to Shopify',
              description: 'Transform raw dropshipper catalog structures into store items.',
              url: '/supplier-csv-to-shopify',
              category: 'Use Case',
            },
            {
              title: 'Shopify CSV Validator',
              description: 'Find missing headers, duplicate SKUs, and formatting errors.',
              url: '/shopify-csv-validator',
              category: 'Audit',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
