'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { CheckCircle, AlertTriangle, ArrowRight, RefreshCw, FileText } from 'lucide-react';

export default function FreeShopifyCsvValidatorTool() {
  const [csvText, setCsvText] = useState(
    `Handle,Title,Body (HTML),Vendor,Type,Tags,SKU,Variant Price\nclassic-tshirt,"Classic T-Shirt","<p>100% Cotton</p>",MyBrand,Apparel,t-shirt,TSHIRT-001,24.99\nclassic-tshirt,"Classic T-Shirt","<p>100% Cotton</p>",MyBrand,Apparel,t-shirt,TSHIRT-001,24.99`
  );
  const [validationResult, setValidationResult] = useState<{
    totalRows: number;
    issuesFound: number;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const handleValidate = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0 || !lines[0]) {
      setValidationResult({
        totalRows: 0,
        issuesFound: 1,
        errors: ['CSV text is empty.'],
        warnings: [],
      });
      return;
    }

    const headers = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
    const errors: string[] = [];
    const warnings: string[] = [];
    const seenSkus = new Set<string>();

    const requiredHeaders = ['Handle', 'Title'];
    requiredHeaders.forEach((req) => {
      if (!headers.some((h) => h.toLowerCase() === req.toLowerCase())) {
        errors.push(`Missing essential Shopify column header: "${req}"`);
      }
    });

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',');

      // SKU index
      const skuIdx = headers.findIndex((h) => h.toLowerCase().includes('sku'));
      if (skuIdx !== -1 && cols[skuIdx]) {
        const skuVal = cols[skuIdx].trim();
        if (seenSkus.has(skuVal)) {
          warnings.push(`Line ${i + 1}: Duplicate SKU detected ("${skuVal}")`);
        } else {
          seenSkus.add(skuVal);
        }
      }

      // Check for unescaped quotes
      if (line.includes('"') && (line.match(/"/g) || []).length % 2 !== 0) {
        errors.push(`Line ${i + 1}: Unmatched quotation marks detected.`);
      }
    }

    setValidationResult({
      totalRows: lines.length - 1,
      issuesFound: errors.length + warnings.length,
      errors,
      warnings,
    });
  };

  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: 'Tools', url: '/tools' },
            { name: 'Shopify CSV Validator', url: '/tools/shopify-csv-validator' },
          ]}
        />

        <div className="max-w-3xl mx-auto py-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Free Online CSV Audit
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free Shopify CSV Validator & Syntax Checker
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Paste your Shopify CSV header or snippet below to check for duplicate SKUs, missing columns, and formatting syntax errors instantly.
          </p>
        </div>

        {/* INTERACTIVE TOOL */}
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 my-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Paste CSV Data or Snippet Below:
          </label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={7}
            className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Handle,Title,SKU,Variant Price..."
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleValidate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Validate CSV Snippet</span>
            </button>
            <button
              onClick={() => setCsvText('')}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
          </div>

          {/* RESULTS */}
          {validationResult && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Audit Summary</h3>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    validationResult.issuesFound > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {validationResult.issuesFound > 0
                    ? `${validationResult.issuesFound} Issue(s) Found`
                    : 'Clean Format Passed'}
                </span>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1 text-rose-800">
                  <span className="font-bold block">Errors (Must Fix Before Shopify Import):</span>
                  {validationResult.errors.map((err, idx) => (
                    <p key={idx}>• {err}</p>
                  ))}
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-800">
                  <span className="font-bold block">Warnings:</span>
                  {validationResult.warnings.map((warn, idx) => (
                    <p key={idx}>• {warn}</p>
                  ))}
                </div>
              )}

              {/* CONVERSION CTA REQUIREMENT */}
              <div className="p-5 bg-indigo-900 text-white rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
                  <FileText className="w-4 h-4" />
                  <span>Found {validationResult.issuesFound} catalog issues? Fix the full file automatically.</span>
                </div>
                <p className="text-xs text-slate-300">
                  CatalogFix SaaS automatically maps raw supplier files, resolves duplicate SKUs, formats multi-option variants, and outputs clean 100% compliant Shopify CSVs.
                </p>
                <div>
                  <Link
                    href="/shopify-csv-converter"
                    className="inline-flex items-center gap-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <span>Fix Complete Supplier CSV Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <RelatedPages
          links={[
            {
              title: 'Duplicate SKU Checker',
              description: 'Find duplicate barcodes across catalog files.',
              url: '/tools/duplicate-sku-checker',
              category: 'Tool',
            },
            {
              title: 'Shopify CSV Converter',
              description: 'Convert raw spreadsheets to official Shopify format.',
              url: '/shopify-csv-converter',
              category: 'Converter',
            },
          ]}
        />
      </div>
    </MarketingShell>
  );
}
