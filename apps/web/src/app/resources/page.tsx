import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata } from '@/lib/seo';
import { BookOpen, Wrench, FileText, ArrowRight } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Ecommerce Catalog & CSV Resources Hub | CatalogFix',
  description:
    'Free tools, CSV templates, formatting guides, and technical articles to help ecommerce merchants manage supplier product data.',
  path: '/resources',
});

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Resources', url: '/resources' }]} />

        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Merchant Knowledge Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Ecommerce Product Data & CSV Resources
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Everything you need to audit, fix, map, and import supplier catalog feeds into your ecommerce store cleanly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto my-8">
          {/* Money Solutions */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Landing Pages & Solutions</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore dedicated conversion tools for Excel, supplier CSVs, Shopify variants, and catalog cleanup.
            </p>
            <ul className="space-y-2 text-xs font-medium text-indigo-600">
              <li>
                <Link href="/shopify-csv-converter" className="hover:underline flex items-center gap-1">
                  <span>Shopify CSV Converter</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/supplier-csv-to-shopify" className="hover:underline flex items-center gap-1">
                  <span>Supplier CSV to Shopify</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/shopify-csv-validator" className="hover:underline flex items-center gap-1">
                  <span>Shopify CSV Validator</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Free Tools */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Free SEO Tools</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use ungated interactive utilities to validate headers, check duplicate SKUs, and format handles.
            </p>
            <ul className="space-y-2 text-xs font-medium text-emerald-600">
              <li>
                <Link href="/tools/shopify-csv-validator" className="hover:underline flex items-center gap-1">
                  <span>Free CSV Validator</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/tools/duplicate-sku-checker" className="hover:underline flex items-center gap-1">
                  <span>Duplicate SKU Checker</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/tools/shopify-handle-generator" className="hover:underline flex items-center gap-1">
                  <span>Shopify Handle Generator</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog & Guides */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Guides & Articles</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In-depth technical guides explaining Shopify CSV rules, variant structures, and import error fixes.
            </p>
            <ul className="space-y-2 text-xs font-medium text-amber-600">
              <li>
                <Link href="/blog/how-to-import-products-to-shopify-using-csv" className="hover:underline flex items-center gap-1">
                  <span>How to Import Products to Shopify</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/blog/shopify-csv-format-explained" className="hover:underline flex items-center gap-1">
                  <span>Shopify CSV Format Explained</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-fix-shopify-csv-import-errors" className="hover:underline flex items-center gap-1">
                  <span>How to Fix Import Errors</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
