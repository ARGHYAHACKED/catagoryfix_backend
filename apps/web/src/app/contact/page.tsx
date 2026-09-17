import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { Mail, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Contact CatalogFix | Support & Technical Assistance',
  description:
    'Get support with supplier catalog formatting, Shopify product imports, custom CSV column mappings, or enterprise volume pricing.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Contact Us', url: '/contact' }]} />

        <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Technical Support & Inquiries
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            We're Here to Help With Your Product Data
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Have questions about custom supplier feeds, Shopify CSV imports, or enterprise catalog limits? Reach out to our technical team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto my-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Email Support</h2>
            <p className="text-xs text-slate-600">Get direct answers from our technical SEO & catalog engineering team.</p>
            <a href="mailto:support@catalogfix.io" className="text-sm font-semibold text-indigo-600 hover:underline block">
              support@catalogfix.io
            </a>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Live Chat</h2>
            <p className="text-xs text-slate-600">Chat with a specialist directly inside your CatalogFix app dashboard.</p>
            <span className="text-sm font-semibold text-emerald-600 block">Available Mon-Fri 9am-6pm EST</span>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Enterprise & Security</h2>
            <p className="text-xs text-slate-600">Request custom NDAs, dedicated server instances, or bulk API SLA pricing.</p>
            <a href="mailto:enterprise@catalogfix.io" className="text-sm font-semibold text-amber-600 hover:underline block">
              enterprise@catalogfix.io
            </a>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
