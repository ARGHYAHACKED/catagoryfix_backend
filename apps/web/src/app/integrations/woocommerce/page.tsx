import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { buildMetadata } from '@/lib/seo';
import { Store, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'WooCommerce Product CSV Integration | CatalogFix',
  description:
    'Convert supplier spreadsheets into WooCommerce Product Importer CSV files with simple and variable product support.',
  path: '/integrations/woocommerce',
  keywords: ['woocommerce csv integration', 'convert csv to woocommerce', 'woocommerce product feed cleaner'],
});

export default function WooCommerceIntegrationPage() {
  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: 'Integrations', url: '/integrations' },
            { name: 'WooCommerce', url: '/integrations/woocommerce' },
          ]}
        />

        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
            WooCommerce Product Importer
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            WooCommerce Product CSV Format
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Format supplier feeds into native WooCommerce Product CSV files compatible with WooCommerce Built-in Product Importer.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 my-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Supported WooCommerce Attributes</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Type (simple, variable, variation)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>SKU & Parent SKU</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Regular & Sale Price</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Attribute 1 & 2 values</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Categories & Tag lists</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Image URLs & Gallery images</span>
            </li>
          </ul>
        </div>
      </div>
    </MarketingShell>
  );
}
