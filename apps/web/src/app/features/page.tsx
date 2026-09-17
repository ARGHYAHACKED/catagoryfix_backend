import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import {
  Cpu,
  Sliders,
  Download,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Table,
  FileSpreadsheet,
  Globe,
  RefreshCw,
  Layers,
  Search,
} from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://catalogfix.io';

export const metadata: Metadata = {
  title: 'Features & AI Capabilities | CatalogFix',
  description:
    'Discover how CatalogFix uses AI header mapping, variant price rounding, and store format exporting to transform supplier spreadsheets into store-ready feeds.',
  keywords: [
    'AI CSV sorter features',
    'Supplier catalog mapping',
    'Variant price calculator',
    'Shopify CSV export tool',
  ],
  alternates: {
    canonical: `${baseUrl}/features`,
  },
  openGraph: {
    title: 'Features & AI Capabilities | CatalogFix',
    description:
      'Discover AI header mapping, variant price rounding, and store format exporting features.',
    url: `${baseUrl}/features`,
  },
};

export default function FeaturesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Features & AI Capabilities | CatalogFix',
    url: `${baseUrl}/features`,
    description: 'Detailed breakdown of CatalogFix AI features for e-commerce catalog sorting.',
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-950 border border-indigo-800/60 px-3 py-1 rounded-full">
            Platform Capabilities
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Built for E-Commerce Data Excellence
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Explore our end-to-end AI catalog cleaning pipeline designed to save hours of manual data entry.
          </p>
        </div>
      </section>

      {/* Main Features Deep-Dive */}
      <section className="py-24 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                1. AI Natural Language Header Mapping
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                Stop manually renaming columns or configuring rigid Excel formulas. CatalogFix uses custom LLM embeddings trained specifically on product catalog taxonomies to accurately match headers regardless of language, typo, or abbreviation.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                  Auto-resolves German, French, Spanish, and Italian supplier CSV headers.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                  Provides confidence percentage ratings for every mapped field.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                  Allows 1-click manual override with instant AI learning.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white font-mono text-xs shadow-xl">
              <div className="text-indigo-400 font-bold mb-3 flex items-center justify-between">
                <span>AI Confidence Matrix</span>
                <span className="text-emerald-400">99.8% Match</span>
              </div>
              <div className="space-y-2">
                <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-rose-300">Supplier: VK-Preis (Netto)</span>
                  <span className="text-indigo-300 font-bold">→ Target: Cost Price</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-rose-300">Supplier: EAN_NUMMER</span>
                  <span className="text-indigo-300 font-bold">→ Target: Barcode / GTIN</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-rose-300">Supplier: BILD_URL_1</span>
                  <span className="text-indigo-300 font-bold">→ Target: Image Src</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            <div className="space-y-6 lg:order-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/30">
                <Sliders className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                2. Automated Variant & Option Extractor
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                Supplier feeds often collapse sizes, colors, and materials into single text blobs like <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">Red / Large / Cotton</code>. CatalogFix splits option strings into proper standardized variant rows.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
                  Separates multi-attribute option strings automatically.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
                  Standardizes size codes (e.g., S, M, L, XL vs Small, Medium, Large).
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
                  Generates store-compliant unique handles & parent SKUs.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white font-mono text-xs shadow-xl lg:order-1">
              <div className="text-cyan-400 font-bold mb-3">Option Splitter Engine</div>
              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <p className="text-slate-400 text-[10px] mb-1">INPUT BLOB:</p>
                  <p className="text-rose-300 font-bold">"Shirt-Heavy Cotton-Navy Blue-XL"</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1">
                  <p className="text-emerald-400 text-[10px] font-bold">PARSED OUTPUT:</p>
                  <p className="text-slate-200">Option 1 Name: <span className="text-cyan-300">Color</span> | Value: <span className="text-white font-bold">Navy Blue</span></p>
                  <p className="text-slate-200">Option 2 Name: <span className="text-cyan-300">Size</span> | Value: <span className="text-white font-bold">XL</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-slate-900 text-white text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-extrabold">Ready to try these features on your own CSV files?</h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all"
          >
            Start Free 14-Day Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
