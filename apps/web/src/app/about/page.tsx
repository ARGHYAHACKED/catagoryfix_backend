import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { ShieldCheck, Award, Users, Globe, FileSpreadsheet, Sparkles } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://catalogfix.io';

export const metadata: Metadata = {
  title: 'About Us | CatalogFix AI',
  description:
    'Learn about our mission to eliminate manual e-commerce spreadsheet work with AI catalog intelligence.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="bg-slate-900 text-white py-20 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-950 border border-indigo-800/60 px-3 py-1 rounded-full">
            Our Story & Mission
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Building the Future of E-Commerce Data Feeds
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Founded by former e-commerce store operators and AI engineers frustrated by hours wasted in Excel every week.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white text-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold">The Problem We Saw</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Every online store deals with dozens of suppliers. Every supplier sends CSV or Excel files with completely different header names, messy foreign language options, unformatted prices, and mixed variant strings.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Store teams spend 15–20 hours per week cleaning spreadsheets manually before products can go live.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">The CatalogFix Solution</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                An intelligent catalog parser that combines machine learning header recognition with automated variant price calculations and store-ready exporters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-black text-indigo-600 font-mono">340+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Stores & Brands</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-indigo-600 font-mono">2.5M+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catalog Rows Cleaned</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-indigo-600 font-mono">99.4%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Accuracy Rating</p>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
