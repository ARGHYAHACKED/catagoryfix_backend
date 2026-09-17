'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { Copy, ArrowRight, AlertTriangle } from 'lucide-react';

export default function DuplicateSkuCheckerTool() {
  const [skuText, setSkuText] = useState('SKU-1001\nSKU-1002\nSKU-1003\nSKU-1001\nSKU-1004\nSKU-1002');
  const [duplicates, setDuplicates] = useState<{ sku: string; count: number }[] | null>(null);

  const handleCheck = () => {
    const lines = skuText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const counts: Record<string, number> = {};
    lines.forEach((sku) => {
      counts[sku] = (counts[sku] || 0) + 1;
    });

    const dupes = Object.entries(counts)
      .filter(([_, count]) => count > 1)
      .map(([sku, count]) => ({ sku, count }));

    setDuplicates(dupes);
  };

  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: 'Tools', url: '/tools' },
            { name: 'Duplicate SKU Checker', url: '/tools/duplicate-sku-checker' },
          ]}
        />

        <div className="max-w-3xl mx-auto py-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Free Online Audit Tool
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free Duplicate SKU & Barcode Checker
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Paste a list of product SKUs or barcodes below to find duplicate identifiers instantly.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 my-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Paste SKUs / Barcodes (One per line):
          </label>
          <textarea
            value={skuText}
            onChange={(e) => setSkuText(e.target.value)}
            rows={7}
            className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={handleCheck}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span>Check for Duplicate SKUs</span>
          </button>

          {duplicates && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {duplicates.length > 0 ? `Found ${duplicates.length} Duplicate SKU(s)` : 'No Duplicate SKUs Found'}
              </h3>

              {duplicates.length > 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-800 font-mono">
                  {duplicates.map((d) => (
                    <p key={d.sku}>
                      • SKU "{d.sku}" appears {d.count} times
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-semibold">All SKUs in this list are unique!</p>
              )}

              <div className="p-5 bg-indigo-900 text-white rounded-xl space-y-3">
                <span className="font-bold text-sm text-indigo-300 block">
                  Found catalog issues? Fix your entire catalog automatically with CatalogFix.
                </span>
                <div>
                  <Link
                    href="/shopify-csv-converter"
                    className="inline-flex items-center gap-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <span>Fix Full Catalog CSV</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MarketingShell>
  );
}
