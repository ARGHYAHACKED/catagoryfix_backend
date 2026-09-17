import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { Shield, Lock, EyeOff, Server, CheckCircle2 } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Security & Data Privacy | CatalogFix Protection Standards',
  description:
    'CatalogFix protects your sensitive supplier pricing, product SKUs, and inventory feeds with enterprise AES-256 encryption, zero public exposure, and GDPR compliance.',
  path: '/security',
});

export default function SecurityPage() {
  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Security', url: '/security' }]} />

        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Enterprise Data Protection
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Security & Confidentiality Guarantees
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Your supplier lists, cost structures, and product data remain 100% private and protected at every layer of our infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto my-8">
          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">AES-256 Encryption at Rest & In Transit</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              All uploaded CSV and Excel files are encrypted in transit using TLS 1.3 and at rest using AES-256 standard encryption. Your data is isolated in secure object storage buckets.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <EyeOff className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Zero Search Indexing of Uploaded Catalog Content</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We explicitly instruct search engine crawlers never to index file previews or processing results. Uploaded catalog contents are non-public, unguessable, and password-protected.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
              <Server className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Automatic File Purging Options</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Set automated retention policies to delete raw supplier spreadsheets and processed CSV files immediately after download or within 24 hours of task completion.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl w-fit">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">GDPR & Privacy Compliant Architecture</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We strictly enforce privacy rights. We do not sell catalog data, send customer SKUs to third-party analytics providers, or share supplier feeds with competitors.
            </p>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
