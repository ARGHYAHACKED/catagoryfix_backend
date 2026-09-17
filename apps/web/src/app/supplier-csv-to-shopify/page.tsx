import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata, buildFAQSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import { Truck, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Supplier CSV to Shopify Converter | Catalog Data Tool',
  description:
    'Convert wholesale supplier CSV feeds and manufacturer spreadsheets into clean Shopify product files. Automate vendor mapping, pricing markups, and variant lists.',
  path: '/supplier-csv-to-shopify',
  keywords: [
    'supplier csv to shopify',
    'supplier product csv',
    'convert supplier csv',
    'shopify supplier product import',
    'shopify supplier data',
  ],
});

const faqs = [
  {
    question: 'How do I map supplier wholesale prices to Shopify retail prices?',
    answer: 'CatalogFix allows you to set pricing formulas (e.g. Wholesale Price * 2.2 + $5.00 shipping) with automated price rounding (.99) during conversion.',
  },
  {
    question: 'Can I import recurring supplier inventory updates without overwriting descriptions?',
    answer: 'Yes. You can output delta update CSV files that update only SKU, Price, and Inventory Quantity columns without overwriting custom titles or SEO tags.',
  },
];

export default function SupplierCsvToShopifyPage() {
  return (
    <MarketingShell>
      <JsonLd data={buildFAQSchema(faqs)} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Supplier CSV to Shopify', url: '/supplier-csv-to-shopify' }]} />

        <div className="text-center py-12 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
            Wholesale & Dropship Supplier Automation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transform Raw Supplier CSV Files into Shopify Products
          </h1>
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Import inventory feeds from manufacturers, wholesalers, and dropshippers directly into your Shopify store without manually editing spreadsheets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Convert Supplier Feed Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* FEATURES */}
        <div className="my-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Automatic Vendor Attribution</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tag products with manufacturer names, supplier SKUs, and inventory locations automatically during import generation.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Pricing Markup Rules</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apply percentage or fixed dollar markups to wholesale costs so your Shopify prices are calculated instantly.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Automated Variant Grouping</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Group separate supplier rows (e.g. SKU-101-RED, SKU-101-BLUE) into a single Shopify parent product with option variants.
            </p>
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
              title: 'Shopify CSV Converter',
              description: 'Convert any supplier spreadsheet to Shopify CSV format.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
            {
              title: 'Product Catalog Cleaner',
              description: 'Clean dirty catalog titles, missing handles, and bad SKUs.',
              url: '/product-catalog-cleaner',
              category: 'Cleanup',
            },
            {
              title: 'Bulk Shopify Product Upload',
              description: 'Learn how to import 10,000+ products into Shopify.',
              url: '/bulk-shopify-product-upload',
              category: 'Guide',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
