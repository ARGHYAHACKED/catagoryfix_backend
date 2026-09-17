import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import {
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  Code2,
  Table,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Shopify CSV Converter | Clean & Format Product Files Instantly',
  description:
    'Convert messy supplier CSV or Excel files into clean, store-ready Shopify product CSV files. Map columns, validate SKUs, extract variants, and fix import errors automatically.',
  path: '/shopify-csv-converter',
  keywords: [
    'shopify csv converter',
    'convert csv to shopify',
    'shopify product csv converter',
    'shopify csv formatting tool',
    'supplier csv to shopify',
  ],
});

const faqs = [
  {
    question: 'How does the Shopify CSV Converter handle variant options?',
    answer: 'The converter automatically parses multi-option variants (e.g. Size, Color, Style) from single strings or split columns, mapping them cleanly to Shopify Option1 Name, Option1 Value, Option2 Name, and Option2 Value fields.',
  },
  {
    question: 'Can I convert Excel (.xlsx) files directly into Shopify CSV format?',
    answer: 'Yes. CatalogFix reads native Excel spreadsheets (.xlsx, .xls) as well as TSV and CSV files without needing manual pre-conversion in Microsoft Excel.',
  },
  {
    question: 'What happens if my supplier file has missing SKUs or handles?',
    answer: 'CatalogFix automatically generates clean URL handles from product titles and flags missing SKUs before export so your Shopify import never fails.',
  },
];

export default function ShopifyCsvConverterPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Shopify CSV Converter', url: '/shopify-csv-converter' }]} />

        {/* HERO */}
        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            Official Shopify CSV Formatting Pipeline
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Convert Messy Supplier CSV & Excel Files into Store-Ready Shopify Product CSVs
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Stop manually copying spreadsheet rows into Shopify template files. Upload any manufacturer or dropshipper catalog and output a 100% compliant Shopify import file in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Convert Product CSV Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tools/shopify-csv-validator"
              className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-base px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Try Free CSV Audit Tool</span>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              AES-256 Confidentiality
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Processes 50,000 Rows in &lt; 30s
            </span>
          </div>
        </div>

        {/* PROBLEM STATEMENT */}
        <div className="my-16 p-8 sm:p-12 bg-rose-50/50 rounded-3xl border border-rose-100">
          <div className="max-w-3xl mx-auto space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>The Ecommerce Merchant Challenge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Importing Supplier CSVs Directly into Shopify Fails
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Supplier catalogs are formatted for warehouse ERPs, not Shopify. Uploading raw manufacturer spreadsheets results in broken variant associations, missing handles, rejected image URLs, and corrupted pricing decimals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-medium text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Unrecognized column names (e.g. "Wholesale_Cost_USD")</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Combined variants in single cells ("Red-XL-Cotton")</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Missing handles causing duplicate product creation</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Malformed HTML descriptions breaking store layouts</span>
              </div>
            </div>
          </div>
        </div>

        {/* HOW CATALOGFIX SOLVES IT */}
        <div className="my-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Automated Shopify CSV Transformation
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              CatalogFix intelligently restructures supplier data into official Shopify CSV schema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. AI Column Mapping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically maps manufacturer headers to official Shopify columns like Handle, Title, Body (HTML), Vendor, SKU, Price, and Image Src.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                <Table className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Variant Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parses multi-option product matrix rows into Option1 Name (Size), Option1 Value (L), Option2 Name (Color), Option2 Value (Blue).
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Error Validation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Checks for duplicate SKUs, invalid price strings, empty titles, and malformed URLs before export.
              </p>
            </div>
          </div>
        </div>

        {/* EXAMPLE INPUT VS OUTPUT */}
        <div className="my-16 p-8 bg-slate-900 text-white rounded-3xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Data Transformation Example</span>
            <h2 className="text-2xl font-bold">Raw Supplier CSV vs Shopify-Ready CSV Output</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 text-xs font-mono">
            {/* Input */}
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
              <span className="text-rose-400 font-bold block mb-2 font-sans text-xs">BEFORE (Messy Supplier Feed)</span>
              <pre className="text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded">
{`Item_Code,Prod_Name,Cost,Opt_String,Img_Link
SUP-8821,"Leather Jacket",45.00,"Black / Large",http://img.com/1.jpg
SUP-8822,"Leather Jacket",45.00,"Black / XL",http://img.com/2.jpg`}
              </pre>
            </div>

            {/* Output */}
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
              <span className="text-emerald-400 font-bold block mb-2 font-sans text-xs">AFTER (Official Shopify CSV Output)</span>
              <pre className="text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded">
{`Handle,Title,Variant SKU,Variant Price,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Image Src
leather-jacket,"Leather Jacket",SUP-8821,89.99,Color,Black,Size,Large,http://img.com/1.jpg
leather-jacket,"Leather Jacket",SUP-8822,89.99,Color,Black,Size,XL,http://img.com/2.jpg`}
              </pre>
            </div>
          </div>
        </div>

        {/* FAQ */}
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

        {/* RELATED SOLUTIONS */}
        <RelatedPages
          links={[
            {
              title: 'Supplier CSV to Shopify',
              description: 'Map wholesale manufacturer catalogs into Shopify store products.',
              url: '/supplier-csv-to-shopify',
              category: 'Use Case',
            },
            {
              title: 'Shopify CSV Validator',
              description: 'Audit existing Shopify CSV files for syntax and schema errors.',
              url: '/shopify-csv-validator',
              category: 'Audit',
            },
            {
              title: 'Excel to Shopify',
              description: 'Convert .xlsx spreadsheets into Shopify product import format.',
              url: '/excel-to-shopify',
              category: 'Converter',
            },
          ]}
        />

        {/* FINAL CTA */}
        <div className="my-12 p-8 sm:p-12 bg-indigo-600 text-white rounded-3xl text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to Convert Your Supplier CSV to Shopify?</h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
            Transform raw spreadsheets into zero-error Shopify import files in under 30 seconds.
          </p>
          <div>
            <Link
              href="/signup"
              className="bg-white text-indigo-600 hover:bg-slate-100 font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>Convert Your Supplier CSV Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
