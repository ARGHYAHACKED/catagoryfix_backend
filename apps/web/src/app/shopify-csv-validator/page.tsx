import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { CheckCircle, AlertTriangle, ArrowRight, FileCheck, ShieldCheck } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Shopify CSV Validator | Find Product Import Errors Before Upload',
  description:
    'Validate Shopify CSV files for syntax errors, missing column headers, duplicate SKUs, broken image links, and invalid variant option structures.',
  path: '/shopify-csv-validator',
  keywords: [
    'shopify csv validator',
    'validate shopify csv',
    'shopify product csv checker',
    'shopify import csv errors',
  ],
});

const faqs = [
  {
    question: 'Why does Shopify give "Illegal quoting on line X" error?',
    answer: 'This error occurs when product HTML descriptions contain unescaped quotation marks or line breaks inside string cells. CatalogFix automatically sanitizes and quotes HTML attributes correctly.',
  },
  {
    question: 'How do I fix missing Option1 Name errors in Shopify CSVs?',
    answer: 'Every variant row in Shopify requires an Option1 Name (e.g. Size). If missing, Shopify fails the row. CatalogFix injects missing default option titles automatically.',
  },
];

export default function ShopifyCsvValidatorPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Shopify CSV Validator', url: '/shopify-csv-validator' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
            Pre-Import CSV Health Checker
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Shopify CSV Validator & Syntax Checker
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Detect broken headers, missing handles, duplicate SKUs, and malformed HTML before uploading your product file to Shopify Admin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/tools/shopify-csv-validator"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Validate CSV File Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* CHECKS PERFORMED */}
        <div className="my-16 max-w-4xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">15 Automated Pre-Import Validation Checks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Required Shopify Column Headers Present</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Duplicate SKU & Barcode Detection</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Handle Format & URL-Safe Encoding</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Option1/Option2 Variant Consistency</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Numeric Price & Compare At Price Format</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Valid Image Src Protocol (http/https)</span>
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

        <RelatedPages
          links={[
            {
              title: 'Free Interactive CSV Validator',
              description: 'Upload your CSV directly to see errors online.',
              url: '/tools/shopify-csv-validator',
              category: 'Free Tool',
            },
            {
              title: 'Shopify CSV Converter',
              description: 'Fix all detected errors automatically and export a clean file.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
            {
              title: 'Duplicate SKU Checker',
              description: 'Find duplicate barcodes and SKUs across catalog files.',
              url: '/tools/duplicate-sku-checker',
              category: 'Free Tool',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
