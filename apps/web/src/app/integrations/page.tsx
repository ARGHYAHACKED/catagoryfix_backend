import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata } from '@/lib/seo';
import { ShoppingBag, ArrowRight, Store, Package } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Ecommerce Integrations & Export Channels | CatalogFix',
  description:
    'Explore supported ecommerce export formats including Shopify, WooCommerce, Amazon, eBay, and custom CSV catalog templates.',
  path: '/integrations',
});

export default function IntegrationsPage() {
  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Integrations', url: '/integrations' }]} />

        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Export Destinations
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Supported Ecommerce Platforms & Channels
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Convert messy supplier spreadsheets into 100% compliant import formats for the world's leading ecommerce platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto my-8">
          {/* Shopify */}
          <Link
            href="/integrations/shopify"
            className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Primary Channel</span>
            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mt-1 mb-3">
              Shopify Product Import Format
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Full support for standard Shopify product import CSV schemas, variant option mapping (Size/Color), image URL arrays, inventory tracking flags, and tags.
            </p>
            <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>View Shopify Integration Details</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>

          {/* WooCommerce */}
          <Link
            href="/integrations/woocommerce"
            className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-bold text-purple-600 tracking-wider">Supported Format</span>
            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors mt-1 mb-3">
              WooCommerce Product CSV
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Transform supplier catalogs into WooCommerce Product Importer CSV format, with support for simple and variable product types, attributes, and categories.
            </p>
            <div className="flex items-center text-sm font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>View WooCommerce Integration Details</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>
        </div>

        {/* Future Platforms Banner */}
        <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Need Amazon, eBay, or Custom Channel Exports?</h3>
            <p className="text-xs text-slate-300">
              Our engineering team builds custom feed output templates for enterprise catalog channels.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-3 rounded-lg transition-colors shrink-0"
          >
            Request Custom Channel Format
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
