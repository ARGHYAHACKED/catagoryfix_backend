import type { Metadata } from 'next';
import { MarketingShell } from '@/components/layout/marketing-shell';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://catalogfix.io';

export const metadata: Metadata = {
  title: 'Terms of Service | CatalogFix',
  description:
    'Review the terms of service and usage conditions for CatalogFix catalog processing platform.',
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Effective Date: September 16, 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white text-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing or using CatalogFix, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Service Usage & Account Responsibilities</h2>
            <p className="text-slate-600">
              You are responsible for maintaining the security of your account credentials and for all activities conducted under your account. You agree not to upload malicious scripts, illegal content, or attempt unauthorized access to platform servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Subscriptions & Billing</h2>
            <p className="text-slate-600">
              Subscriptions auto-renew monthly or annually based on your selected plan. You can cancel your subscription at any time via the billing portal. Refunds are subject to our 14-day trial money-back guarantee policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitation of Liability</h2>
            <p className="text-slate-600">
              CatalogFix provides the service on an "as is" and "as available" basis. While we strive for 99.9% uptime and high AI mapping accuracy, we are not liable for indirect damages resulting from spreadsheet processing errors or store import downtime.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
