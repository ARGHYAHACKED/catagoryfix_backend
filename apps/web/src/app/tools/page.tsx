import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { Wrench, CheckCircle, Copy, FileCode, Sparkles, ArrowRight } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Free Ecommerce CSV & Shopify Tools | CatalogFix',
  description:
    'Free online tools for Shopify merchants: CSV validator, duplicate SKU checker, CSV header validator, and Shopify handle generator. No login required.',
  path: '/tools',
  keywords: [
    'free shopify csv tools',
    'shopify csv validator online',
    'duplicate sku checker',
    'csv header checker',
    'shopify handle generator',
  ],
});

export default function ToolsHubPage() {
  const tools = [
    {
      title: 'Shopify CSV Validator Tool',
      description: 'Paste or upload your CSV to check for missing headers, illegal quotes, unescaped HTML, and invalid pricing columns.',
      url: '/tools/shopify-csv-validator',
      icon: CheckCircle,
      tag: 'Most Popular',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Duplicate SKU & Barcode Checker',
      description: 'Upload a CSV or list of SKUs to instantly detect duplicates before importing into Shopify Admin or ERPs.',
      url: '/tools/duplicate-sku-checker',
      icon: Copy,
      tag: 'Audit Tool',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'CSV Header Checker',
      description: 'Compare your raw supplier CSV column names against official Shopify CSV headers to see missing required fields.',
      url: '/tools/csv-header-checker',
      icon: FileCode,
      tag: 'Mapping',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Shopify URL Handle Generator',
      description: 'Generate clean, URL-safe Shopify product handles from titles or raw SKU strings automatically.',
      url: '/tools/shopify-handle-generator',
      icon: Sparkles,
      tag: 'Generator',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Tools', url: '/tools' }]} />

        <div className="text-center py-12 max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Wrench className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            100% Free Ungated Utilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Free Ecommerce CSV & Catalog Tools
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Free online tools for Shopify store owners, developers, and catalog managers. Audit and check your catalog data instantly without registering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto my-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.url}
                href={tool.url}
                className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${tool.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                      {tool.tag}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {tool.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Use Free Tool Online</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto my-12 p-8 bg-indigo-600 text-white rounded-3xl text-center space-y-4">
          <h2 className="text-2xl font-extrabold">Need to Fix Thousands of Catalog Errors Automatically?</h2>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto">
            Our free tools audit single snippets. CatalogFix SaaS transforms 50,000-row supplier files automatically with AI mapping.
          </p>
          <div>
            <Link
              href="/shopify-csv-converter"
              className="bg-white text-indigo-600 hover:bg-slate-100 font-bold text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <span>Explore Full Shopify CSV Converter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
