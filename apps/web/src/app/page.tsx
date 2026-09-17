'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import {
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Layers,
  Sliders,
  DollarSign,
  Download,
  Database,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRightLeft,
  EyeOff,
  Wrench,
  Calculator,
  RotateCw,
} from 'lucide-react';

export default function CatalogFixHomepage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [simulatedView, setSimulatedView] = useState<'RAW' | 'CLEAN' | 'MAPPED'>('CLEAN');
  const [catalogSize, setCatalogSize] = useState<number>(2500);

  const calculateHoursSaved = (rows: number) => Math.round((rows * 2) / 60);
  const calculateMoneySaved = (rows: number) => Math.round(calculateHoursSaved(rows) * 40);

  const faqs = [
    {
      q: 'How does CatalogFix handle custom or foreign supplier headers?',
      a: 'CatalogFix analyzes column names and sample row data to automatically map foreign or non-standard headers (like "VK-Preis", "qty_avail", or "prod_title_v2") to standard store fields like Price, Inventory, and Title with high confidence.',
    },
    {
      q: 'Is my CSV data private and secure?',
      a: 'Yes. Your supplier CSV files stay strictly private. Data is encrypted in transit and at rest using AES-256 standards, and we never sell or share your supplier pricing or catalog data.',
    },
    {
      q: 'Can I export directly into Shopify CSV format?',
      a: 'Yes. CatalogFix formats output CSV files specifically according to Shopify import specifications, including correct handles, variant options, pricing, image URLs, and inventory counts.',
    },
    {
      q: 'What happens when data errors are detected during scanning?',
      a: 'The validation engine flags missing titles, duplicate SKUs, negative inventory, or invalid prices in a compact issue breakdown. You can fix errors directly in the interface before exporting.',
    },
  ];

  const supportedAttributes = [
    'Product Titles',
    'SKUs',
    'Prices',
    'Compare-at Prices',
    'Inventory',
    'Vendor',
    'Categories',
    'Tags',
    'Barcodes',
    'Images',
    'Descriptions',
    'Weight',
    'Color',
    'Size',
    'Material',
    'Variants',
  ];

  return (
    <MarketingShell>
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 border-b border-slate-800">
        {/* Animated Background Gradients & Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-purple-600/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-blue-500/10 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6 mb-16">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-indigo-500/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/10 hover:border-indigo-500/60 transition-all cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Next-Gen E-Commerce Catalog Cleanup Engine</span>
            </div>

            {/* Main Heading with Gradient Text */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black text-white tracking-tight leading-[1.06]">
              Turn messy supplier CSVs into{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
                Shopify-ready catalogs.
              </span>
            </h1>

            {/* Supporting Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Automate column mapping, fix invalid pricing, normalize variant options, and catch duplicate SKUs in seconds without writing a single Excel formula.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-base font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                <span>Clean Your First CSV Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#interactive-demo"
                className="w-full sm:w-auto bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-base font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Try Live Demo</span>
              </a>
            </div>

            {/* Micro Trust Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> AES-256 Private Encryption
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Instant Shopify CSV Download
              </span>
            </div>
          </div>

          {/* ── 2. INTERACTIVE LIVE SIMULATOR DEMO ── */}
          <div id="interactive-demo" className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-30 blur-xl animate-pulse" />
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

              {/* Demo Window Header */}
              <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="h-4 w-px bg-slate-800" />
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                    <span>CatalogFix Data Pipeline & Sanitizer</span>
                  </div>
                </div>

                {/* Interactive State Toggle Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
                  <button
                    onClick={() => setSimulatedView('RAW')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      simulatedView === 'RAW'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Messy Input
                  </button>
                  <button
                    onClick={() => setSimulatedView('MAPPED')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      simulatedView === 'MAPPED'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Column Mapping
                  </button>
                  <button
                    onClick={() => setSimulatedView('CLEAN')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      simulatedView === 'CLEAN'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Clean Shopify CSV ✨
                  </button>
                </div>
              </div>

              {/* Demo Interactive Body */}
              <div className="p-6 font-mono text-xs space-y-4 min-h-[320px] bg-slate-950/80">
                {simulatedView === 'RAW' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between text-rose-400 text-xs font-sans pb-2 border-b border-slate-900">
                      <span className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Raw Supplier Spreadsheet (Unsanitized)
                      </span>
                      <span>5 Data Errors Flagged</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-900 text-[11px]">
                            <th className="p-2">prod_title_v2</th>
                            <th className="p-2">whsl_cost_usd</th>
                            <th className="p-2">qty_avail</th>
                            <th className="p-2">sku_ref</th>
                            <th className="p-2">colour_val</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-300">
                          <tr>
                            <td className="p-2 text-rose-400 bg-rose-950/20 border-l-2 border-rose-500">
                              (missing title)
                            </td>
                            <td className="p-2 text-amber-300">$22.50 USD</td>
                            <td className="p-2">14 units</td>
                            <td className="p-2 font-bold text-white">HD-BLU-XL</td>
                            <td className="p-2">BLUE</td>
                          </tr>
                          <tr>
                            <td className="p-2">Classic Heavy Hoodie</td>
                            <td className="p-2 text-rose-400 bg-rose-950/20 border-l-2 border-rose-500">
                              -$5.00
                            </td>
                            <td className="p-2 text-amber-300">Out of Stock</td>
                            <td className="p-2 text-rose-400 font-bold bg-rose-950/20">
                              HD-BLU-XL (DUP)
                            </td>
                            <td className="p-2">Blue / Navy</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {simulatedView === 'MAPPED' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between text-indigo-300 text-xs font-sans pb-2 border-b border-slate-900">
                      <span className="font-bold flex items-center gap-1.5">
                        <Layers className="w-4 h-4" /> Automated Attribute Mapping Rules
                      </span>
                      <span>High Confidence Match</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-mono">prod_title_v2</p>
                          <p className="font-bold text-white text-xs">Product Title</p>
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                          99% Match
                        </span>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-mono">whsl_cost_usd</p>
                          <p className="font-bold text-white text-xs">Price (USD Sanitized)</p>
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                          Parsed & Cleaned
                        </span>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-mono">qty_avail</p>
                          <p className="font-bold text-white text-xs">Inventory Quantity</p>
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                          Numeric Extracted
                        </span>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-mono">colour_val</p>
                          <p className="font-bold text-white text-xs">Option1 Value (Color)</p>
                        </div>
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                          Normalized
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {simulatedView === 'CLEAN' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between text-emerald-400 text-xs font-sans pb-2 border-b border-slate-900">
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> 100% Validated Shopify CSV Format
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                        Ready for Shopify Import
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-900 text-[11px]">
                            <th className="p-2">Handle</th>
                            <th className="p-2">Title</th>
                            <th className="p-2">Variant SKU</th>
                            <th className="p-2">Variant Price</th>
                            <th className="p-2">Variant Inventory Qty</th>
                            <th className="p-2">Option1 Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-200">
                          <tr className="bg-emerald-950/10">
                            <td className="p-2 text-indigo-300 font-mono">classic-heavy-hoodie</td>
                            <td className="p-2 font-bold text-white">Classic Heavy Hoodie</td>
                            <td className="p-2 font-mono text-emerald-300">HD-BLU-XL</td>
                            <td className="p-2 font-mono text-emerald-400 font-bold">49.99</td>
                            <td className="p-2 font-mono text-emerald-400 font-bold">14</td>
                            <td className="p-2">Blue</td>
                          </tr>
                          <tr className="bg-emerald-950/10">
                            <td className="p-2 text-indigo-300 font-mono">classic-heavy-hoodie</td>
                            <td className="p-2 font-bold text-white">Classic Heavy Hoodie</td>
                            <td className="p-2 font-mono text-emerald-300">HD-BLU-2XL</td>
                            <td className="p-2 font-mono text-emerald-400 font-bold">54.99</td>
                            <td className="p-2 font-mono text-slate-400">0</td>
                            <td className="p-2">Blue</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE TIME & COST SAVINGS CALCULATOR ── */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              ROI & Time Savings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How much time will CatalogFix save your team?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Adjust the slider based on your monthly supplier product row volume to calculate hours and labor costs saved.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 p-8 rounded-3xl space-y-8 shadow-2xl">
            {/* Slider Controls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-300">Monthly Product Catalog Rows:</span>
                <span className="font-mono text-xl font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                  {catalogSize.toLocaleString()} rows / mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={catalogSize}
                onChange={(e) => setCatalogSize(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>500 products</span>
                <span>10,000 products</span>
                <span>50,000 products</span>
              </div>
            </div>

            {/* Savings Display Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-1">
                <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400 font-semibold uppercase">Hours Saved</p>
                <p className="text-3xl font-black text-white font-mono">
                  ~{calculateHoursSaved(catalogSize)} hrs
                </p>
                <p className="text-[11px] text-slate-500">per month</p>
              </div>

              <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-1 bg-emerald-950/10">
                <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-emerald-400 font-semibold uppercase">Est. Labor Saved</p>
                <p className="text-3xl font-black text-emerald-400 font-mono">
                  ${calculateMoneySaved(catalogSize).toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500">at $40/hr labor rate</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-1">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-xs text-slate-400 font-semibold uppercase">Processing Speed</p>
                <p className="text-3xl font-black text-amber-300 font-mono">120x</p>
                <p className="text-[11px] text-slate-500">faster than Excel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS (ANIMATED 3-STEP PIPELINE) ── */}
      <section id="how-it-works" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              Automated Data Pipeline
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              3 steps to error-free store catalogs
            </h2>
            <p className="text-slate-600 text-base">
              Eliminate manual copy-pasting and broken Shopify imports forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-5 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Upload Raw Supplier CSV</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload raw CSV, XLSX, or TSV catalog feeds from any wholesaler regardless of header naming or column order.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-5 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Auto-Map & Validate Rules</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Map supplier columns to Shopify store attributes. Detect missing titles, pricing errors, and duplicate SKUs instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-5 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Export Shopify CSV</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Download structured CSV files ready for 100% clean import into Shopify or WooCommerce without column errors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. DEFAULT IGNORED PARAMETERS TEASER SECTION ── */}
      <section className="py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Safeguarded Data Protection</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Non-standard supplier fields are safely isolated by default.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Wholesale cost prices, customs HS codes, and raw JSON metafields are kept in a protected registry until you choose to whitelist them. This prevents unintended price leaks or Shopify schema import crashes.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin/ignored-parameters"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 border border-indigo-500/30 px-5 py-2.5 rounded-xl transition-all hover:bg-indigo-500/20"
                >
                  <span>Explore Default Ignored Parameters Registry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <span className="font-bold text-white">Default Ignored Parameters</span>
                <span className="text-rose-400 font-sans text-[11px] font-bold">Auto-Bypassed</span>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">whsl_cost_usd (Cost Price)</span>
                  <span className="bg-rose-950/60 text-rose-300 border border-rose-800 text-[10px] px-2 py-0.5 rounded">
                    Ignored by Default
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">hs_code / customs_tariff</span>
                  <span className="bg-rose-950/60 text-rose-300 border border-rose-800 text-[10px] px-2 py-0.5 rounded">
                    Ignored by Default
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">metafield_json_extra</span>
                  <span className="bg-rose-950/60 text-rose-300 border border-rose-800 text-[10px] px-2 py-0.5 rounded">
                    Ignored by Default
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PRICING SECTION ── */}
      <section id="pricing" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Transparent, Volume-Based Pricing
            </h2>
            <p className="text-slate-600 text-base">
              Choose the plan built for your catalog size. No hidden setup fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-md hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Starter</h3>
                <p className="text-xs text-slate-500 mb-6">For single e-commerce stores</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">$9</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg mb-6">
                  10,000 product rows / mo
                </p>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Standard Column Mapping
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Data Error Validation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Shopify CSV Export
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan (Recommended) */}
            <div className="bg-white border-2 border-indigo-600 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Pro</h3>
                <p className="text-xs text-slate-500 mb-6">For growing store ops & agencies</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-indigo-600 font-mono">$19</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg mb-6">
                  100,000 product rows / mo
                </p>
                <ul className="space-y-3 text-sm text-slate-900 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Everything in Starter
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Variant Option Normalization
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Price Margin & Rounding
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Priority Support
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/30"
              >
                Try Pro Free
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-md hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Enterprise</h3>
                <p className="text-xs text-slate-500 mb-6">For large retail catalog feeds</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">$49</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg mb-6">
                  Unlimited product rows
                </p>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Custom API Sync
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600" /> Dedicated Account Manager
                  </li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION ── */}
      <section id="faq" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`border border-slate-200 rounded-xl overflow-hidden transition-all ${
                    isOpen ? 'bg-slate-50 border-indigo-200' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left font-bold text-slate-900 flex items-center justify-between gap-4 text-base hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CALL TO ACTION ── */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-[1240px] mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Ready to clean and map your supplier CSV files?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-normal">
            Start transforming messy e-commerce feeds into Shopify-ready catalogs in less than 2 minutes.
          </p>
          <div className="pt-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-base font-bold px-9 py-4 rounded-xl shadow-2xl shadow-indigo-600/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Upload Your CSV Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
