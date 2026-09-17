'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { FileCode, ArrowRight } from 'lucide-react';

export default function CsvHeaderCheckerTool() {
  const [headerInput, setHeaderInput] = useState('Item_Code, Product_Title, Description, Wholesale_Cost, Image_URL');
  const [report, setReport] = useState<{ mapped: string[]; unmapped: string[]; missingRequired: string[] } | null>(null);

  const officialShopifyHeaders = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Variant SKU',
    'Variant Price',
    'Image Src',
  ];

  const handleCheckHeaders = () => {
    const rawHeaders = headerInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);
    const mapped: string[] = [];
    const unmapped: string[] = [];

    rawHeaders.forEach((h) => {
      const lower = h.toLowerCase();
      if (
        lower.includes('title') ||
        lower.includes('handle') ||
        lower.includes('sku') ||
        lower.includes('price') ||
        lower.includes('image') ||
        lower.includes('vendor')
      ) {
        mapped.push(h);
      } else {
        unmapped.push(h);
      }
    });

    const missingRequired = ['Handle', 'Title', 'Variant Price'].filter(
      (req) => !rawHeaders.some((rh) => rh.toLowerCase().includes(req.toLowerCase()))
    );

    setReport({ mapped, unmapped, missingRequired });
  };

  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: 'Tools', url: '/tools' },
            { name: 'CSV Header Checker', url: '/tools/csv-header-checker' },
          ]}
        />

        <div className="max-w-3xl mx-auto py-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Free Header Audit
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free CSV Header Mapping Checker
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Paste your raw supplier CSV header row to see how it aligns with official Shopify columns.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 my-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Paste Header Row (Comma separated):
          </label>
          <input
            type="text"
            value={headerInput}
            onChange={(e) => setHeaderInput(e.target.value)}
            className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <button
            onClick={handleCheckHeaders}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            <span>Check Header Compatibility</span>
          </button>

          {report && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 text-xs">
              {report.missingRequired.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                  <span className="font-bold block">Missing Essential Shopify Fields:</span>
                  {report.missingRequired.map((m) => (
                    <p key={m}>• Missing standard column for "{m}"</p>
                  ))}
                </div>
              )}

              <div className="p-5 bg-indigo-900 text-white rounded-xl space-y-3">
                <span className="font-bold text-sm text-indigo-300 block">
                  Want to map supplier headers automatically with AI?
                </span>
                <div>
                  <Link
                    href="/shopify-csv-converter"
                    className="inline-flex items-center gap-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <span>Try AI Column Mapping Engine</span>
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
