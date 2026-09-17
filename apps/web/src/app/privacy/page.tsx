import type { Metadata } from 'next';
import { MarketingShell } from '@/components/layout/marketing-shell';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://catalogfix.io';

export const metadata: Metadata = {
  title: 'Privacy Policy | CatalogFix',
  description:
    'Read the CatalogFix Privacy Policy to understand how we collect, protect, and process user catalog data.',
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: September 16, 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white text-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="text-slate-600">
              When you use CatalogFix, we collect account information (such as your name, email address, and billing details) and file data uploaded to our service for processing. Uploaded supplier spreadsheets are processed securely to provide column mapping and variant formatting.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Data Privacy & Confidentiality</h2>
            <p className="text-slate-600">
              We strictly maintain data confidentiality. We do NOT sell, rent, or share your product catalog data, supplier prices, or customer information with third parties. Your uploaded files are never used to train public AI models.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Security Standards</h2>
            <p className="text-slate-600">
              All data transmitted to CatalogFix is encrypted using SSL/TLS protocols. Files stored at rest are encrypted using AES-256 standards with strict access controls.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. GDPR Rights</h2>
            <p className="text-slate-600">
              European Union users have the right to access, rectify, or request deletion of personal data stored in our systems at any time by contacting support@catalogfix.io.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
