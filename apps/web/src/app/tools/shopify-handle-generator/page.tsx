'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Sparkles, ArrowRight, Copy } from 'lucide-react';

export default function ShopifyHandleGeneratorTool() {
  const [titleInput, setTitleInput] = useState('Men\'s Vintage Leather Jacket (100% Genuine)');
  const [handleResult, setHandleResult] = useState('mens-vintage-leather-jacket-100-genuine');

  const generateHandle = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleInputChange = (val: string) => {
    setTitleInput(val);
    setHandleResult(generateHandle(val));
  };

  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: 'Tools', url: '/tools' },
            { name: 'Shopify Handle Generator', url: '/tools/shopify-handle-generator' },
          ]}
        />

        <div className="max-w-3xl mx-auto py-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            Free URL Generator
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free Shopify Handle & Slug Generator
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Convert product titles into clean, URL-safe Shopify handles automatically.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 my-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter Product Title:
          </label>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-3 font-sans text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <div className="p-4 bg-slate-100 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Generated Shopify Handle:
            </span>
            <div className="flex items-center justify-between font-mono text-sm text-slate-900 font-bold bg-white p-3 rounded-lg border border-slate-200">
              <span className="truncate">{handleResult}</span>
            </div>
          </div>

          <div className="p-5 bg-indigo-900 text-white rounded-xl space-y-3 mt-6">
            <span className="font-bold text-sm text-indigo-300 block">
              Need to generate 10,000 Shopify handles automatically in bulk?
            </span>
            <div>
              <Link
                href="/shopify-csv-converter"
                className="inline-flex items-center gap-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-lg transition-colors"
              >
                <span>Convert Complete Catalog Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
