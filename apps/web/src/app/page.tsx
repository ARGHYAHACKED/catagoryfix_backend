'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Columns3,
  Copy,
  Layers,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';

type View = 'raw' | 'mapped' | 'clean';
type Platform = 'shopify' | 'woo' | 'csv';

const TABS: Array<{ id: View; label: string; on: string }> = [
  { id: 'raw', label: '1. Messy input', on: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
  { id: 'mapped', label: '2. Mapping', on: 'bg-blue-500/20 text-blue-200 border-blue-500/45' },
  { id: 'clean', label: '3. Clean export', on: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
];

const PLATFORMS: Record<Platform, { label: string; cols: string[]; id: string; row2: string }> = {
  shopify: { label: 'Shopify', cols: ['Handle', 'Title', 'Variant SKU', 'Variant Price', 'Variant Inventory Qty', 'Option1 Value'], id: 'classic-heavy-hoodie', row2: '' },
  woo: { label: 'WooCommerce', cols: ['Parent', 'Name', 'SKU', 'Regular price', 'Stock', 'Attribute 1 value(s)'], id: 'HD-BLU', row2: 'Classic Heavy Hoodie' },
  csv: { label: 'Any CSV', cols: ['product_id', 'title', 'sku', 'price', 'stock', 'color'], id: 'P-1001', row2: 'Classic Heavy Hoodie' },
};

const STATS: Record<View, Array<[string, string, string]>> = {
  raw: [['Rows', '2', 'text-slate-50'], ['Problems', '5', 'text-rose-300'], ['Duplicate SKUs', '1', 'text-amber-300'], ['Import-ready', 'No', 'text-rose-300']],
  mapped: [['Columns', '5', 'text-slate-50'], ['Auto-mapped', '4 / 5', 'text-blue-200'], ['Confidence', '97%', 'text-emerald-300'], ['Held back', '1', 'text-slate-300']],
  clean: [['Products', '1', 'text-slate-50'], ['Variants', '2', 'text-blue-200'], ['Problems left', '0', 'text-emerald-300'], ['Import-ready', 'Yes', 'text-emerald-300']],
};

const MAPPINGS = [
  { from: 'prod_title_v2', to: 'Title', conf: '99%' },
  { from: 'whsl_cost_usd', to: 'Price', conf: '96%' },
  { from: 'qty_avail', to: 'Stock quantity', conf: '98%' },
  { from: 'colour_val', to: 'Option: Color', conf: '95%' },
];

const STEPS = [
  { title: 'Upload your supplier file', body: 'Drop in a CSV, Excel, TSV or XML feed from any wholesaler, whatever the column names or order.' },
  { title: 'Review the automatic fixes', body: 'Columns are matched to standard product fields and problems are flagged: missing titles, bad prices, duplicate SKUs.' },
  { title: 'Export for your platform', body: 'Download a file for Shopify or a plain CSV, with variants grouped under the right product.' },
];

const FEATURES = [
  { icon: Columns3, title: 'Smart column mapping', body: 'Matches supplier headers to product fields using names and sample data, with a confidence score for each.' },
  { icon: Layers, title: 'Variant grouping', body: 'Rows for the same product are grouped together with Size, Color and Material options.' },
  { icon: Tag, title: 'Price & stock cleanup', body: 'Strips currency text, fixes negative or text values like “Out of Stock”, and applies your rounding rules.' },
  { icon: Copy, title: 'Duplicate SKU detection', body: 'Finds repeated and conflicting SKUs before they overwrite products in your store.' },
  { icon: ShieldCheck, title: 'Import validation', body: 'Checks every row against your platform’s import rules so the upload doesn’t fail halfway.' },
  { icon: Lock, title: 'Sensitive fields held back', body: 'Wholesale cost, customs codes and raw metadata stay out of the export unless you choose to include them.' },
];

const PLANS = [
  { name: 'Starter', blurb: 'For single stores', price: '$9', rows: '10,000 product rows / month', items: ['Automatic column mapping', 'Data validation', 'Shopify & CSV export'], cta: 'Start free trial', popular: false },
  { name: 'Pro', blurb: 'For growing stores & agencies', price: '$19', rows: '100,000 product rows / month', items: ['Everything in Starter', 'Variant option normalization', 'Price margin & rounding rules', 'Priority support'], cta: 'Try Pro free', popular: true },
  { name: 'Enterprise', blurb: 'For large catalog feeds', price: '$49', rows: 'Unlimited product rows', items: ['Everything in Pro', 'Custom API sync', 'Dedicated account manager'], cta: 'Contact sales', popular: false },
];

const FAQS = [
  { q: 'How does CatalogFix handle unusual supplier headers?', a: 'It reads column names and sample values to match non-standard headers — like "VK-Preis", "qty_avail" or "prod_title_v2" — to standard product fields such as Price, Stock and Title. You can review and change every match before exporting.' },
  { q: 'Which store platforms can I export to?', a: 'Shopify product CSV today, plus a plain CSV with standard columns that most other platforms and marketplaces can import. WooCommerce export is coming soon.' },
  { q: 'Is my supplier data private?', a: 'Yes. Your files are encrypted in transit and at rest, and your pricing and catalog data is never sold or shared.' },
  { q: 'What happens when errors are found?', a: 'Missing titles, duplicate SKUs, negative stock and invalid prices are listed in an issue summary, and you can fix them in the app before you export.' },
];

const eyebrow = 'mb-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-300';
const h2 = 'text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-[40px]';
const muted = 'text-slate-600 dark:text-slate-300';
const card = 'rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900';

export default function HomePage() {
  const [view, setView] = useState<View>('clean');
  const [platform, setPlatform] = useState<Platform>('shopify');
  const [rows, setRows] = useState(2500);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const hours = Math.round((rows * 2) / 60);
  const pf = PLATFORMS[platform];

  return (
    <MarketingShell>
      <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* ── HERO ── */}
        <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:pb-24 lg:pt-20">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[13px] font-semibold text-blue-800 dark:border-blue-500/35 dark:bg-blue-500/15 dark:text-blue-200">
                <span className="h-[7px] w-[7px] rounded-full bg-emerald-600 dark:bg-emerald-400" />
                For online stores, wholesalers &amp; catalog teams
              </span>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[56px]">
                Turn messy supplier files into{' '}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
                  clean, store-ready catalogs.
                </span>
              </h1>
              <p className={`max-w-[520px] text-lg ${muted}`}>
                Upload any CSV, Excel or XML product feed. CatalogFix maps the columns, fixes prices and stock, groups variants and
                catches duplicate SKUs — then exports a file your store platform accepts first time.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500 active:translate-y-0 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Clean your first file free
                  <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  See how it works
                </a>
              </div>
              <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm ${muted}`}>
                {['No credit card required', 'Works with any supplier format', 'Your data stays private'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.6} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product demo — always dark, like a code/data window */}
            <div
              className={`min-w-0 flex-[1_1_520px] overflow-hidden rounded-[18px] border border-slate-800 bg-slate-900 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.5)] animate-fade-in-up`}
              style={{ animationDelay: '150ms' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                <span className="font-mono text-xs text-slate-300">supplier_feed_nov.xlsx</span>
                <div role="tablist" aria-label="Pipeline step" className="flex gap-1 rounded-[10px] border border-slate-800 bg-slate-950 p-1">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={view === t.id}
                      onClick={() => setView(t.id)}
                      className={`min-h-8 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        view === t.id ? t.on : 'border-transparent text-slate-300 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-[248px] px-4 pb-2 pt-[18px] font-mono text-xs" role="tabpanel">
                {view === 'raw' && (
                  <div className="animate-fade-in">
                    <p className="mb-3 font-sans text-[13px] font-semibold text-rose-300">Raw supplier export — 5 problems found</p>
                    <div className="overflow-x-auto">
                      <table className="w-full whitespace-nowrap text-left text-slate-200">
                        <thead>
                          <tr className="text-slate-400">
                            {['prod_title_v2', 'whsl_cost_usd', 'qty_avail', 'sku_ref', 'colour_val'].map((h) => (
                              <th key={h} className="p-2 font-normal">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-slate-800">
                            <td className="bg-rose-500/10 p-2 text-rose-300">(missing)</td>
                            <td className="p-2 text-amber-300">$22.50 USD</td>
                            <td className="p-2">14 units</td>
                            <td className="p-2">HD-BLU-XL</td>
                            <td className="p-2">BLUE</td>
                          </tr>
                          <tr className="border-t border-slate-800">
                            <td className="p-2">Classic Heavy Hoodie</td>
                            <td className="bg-rose-500/10 p-2 text-rose-300">-$5.00</td>
                            <td className="p-2 text-amber-300">Out of Stock</td>
                            <td className="bg-rose-500/10 p-2 text-rose-300">HD-BLU-XL</td>
                            <td className="p-2">Blue / Navy</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {view === 'mapped' && (
                  <div className="animate-fade-in">
                    <p className="mb-3 font-sans text-[13px] font-semibold text-blue-300">Columns matched to standard product fields</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {MAPPINGS.map((m) => (
                        <div key={m.from} className="flex items-center justify-between gap-2 rounded-[10px] border border-slate-800 bg-slate-950 px-3 py-2.5">
                          <div>
                            <div className="text-slate-400">{m.from}</div>
                            <div className="font-sans text-[13px] font-semibold text-slate-50">{m.to}</div>
                          </div>
                          <span className="text-[11px] text-emerald-300">{m.conf}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {view === 'clean' && (
                  <div className="animate-fade-in">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
                      <p className="font-sans text-[13px] font-semibold text-emerald-300">Clean export — ready to import</p>
                      <div role="radiogroup" aria-label="Export format" className="flex gap-1 font-sans">
                        {(Object.keys(PLATFORMS) as Platform[]).map((k) => (
                          <button
                            key={k}
                            type="button"
                            role="radio"
                            aria-checked={platform === k}
                            onClick={() => setPlatform(k)}
                            className={`min-h-7 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              platform === k ? 'border-[#f8fafc] bg-[#f8fafc] text-[#0f172a]' : 'border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            {PLATFORMS[k].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full whitespace-nowrap text-left text-slate-200">
                        <thead>
                          <tr className="text-slate-400">
                            {pf.cols.map((c) => (
                              <th key={c} className="whitespace-nowrap p-2 font-normal">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-slate-800">
                            <td className="p-2 text-blue-300">{pf.id}</td>
                            <td className="p-2">Classic Heavy Hoodie</td>
                            <td className="p-2">HD-BLU-XL</td>
                            <td className="p-2 text-emerald-300">49.99</td>
                            <td className="p-2">14</td>
                            <td className="p-2">Blue</td>
                          </tr>
                          <tr className="border-t border-slate-800">
                            <td className="p-2 text-blue-300">{pf.id}</td>
                            <td className="p-2">{pf.row2}</td>
                            <td className="p-2">HD-BLU-2XL</td>
                            <td className="p-2 text-emerald-300">54.99</td>
                            <td className="p-2">0</td>
                            <td className="p-2">Blue</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 border-t border-slate-800 bg-slate-950 sm:grid-cols-4">
                {STATS[view].map(([label, value, tone]) => (
                  <div key={label} className="px-4 py-3">
                    <div className="text-[11px] text-slate-400">{label}</div>
                    <div className={`font-mono text-[15px] font-semibold ${tone}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PLATFORMS STRIP ── */}
        <section className="border-b border-slate-200 dark:border-slate-800">
          <div className={`mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-7 gap-y-3 px-4 py-7 text-sm sm:px-6 ${muted}`}>
            <span className="font-bold text-slate-900 dark:text-white">Reads</span>
            <span>CSV</span>
            <span>Excel</span>
            <span>TSV</span>
            <span>XML feeds</span>
            <ArrowRight className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <span className="font-bold text-slate-900 dark:text-white">Exports to</span>
            <span>Shopify</span>
            <span>Plain CSV for any platform</span>
            <span>WooCommerce (coming soon)</span>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="scroll-mt-20">
          <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
            <div className="mx-auto mb-14 max-w-[640px] text-center">
              <p className={eyebrow}>How it works</p>
              <h2 className={`${h2} mb-3.5`}>Three steps from supplier file to storefront</h2>
              <p className={`text-[17px] ${muted}`}>No spreadsheet formulas, no copy-pasting between tabs, no failed imports.</p>
            </div>
            <ol className="grid gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className={`${card} flex flex-col gap-3 p-7`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-extrabold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                    {i + 1}
                  </span>
                  <h3 className="text-[19px] font-bold">{s.title}</h3>
                  <p className={`text-[15px] ${muted}`}>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="scroll-mt-20 border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[600px]">
                <p className={eyebrow}>What gets fixed</p>
                <h2 className={h2}>Every problem that breaks a product import</h2>
              </div>
              <Link href="/signup" className="text-[15px] font-semibold text-blue-700 hover:underline dark:text-blue-300">
                Try it on your own file →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className={`${card} flex flex-col gap-2.5 p-6 transition hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/30`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
                    <f.icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-1 text-[17px] font-bold">{f.title}</h3>
                  <p className={`text-[15px] ${muted}`}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIME SAVED ── */}
        <section>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-4 py-24 sm:px-6">
            <div className="min-w-0 flex-[1_1_380px]">
              <p className={eyebrow}>Time saved</p>
              <h2 className={`${h2} mb-3.5`}>How many hours does manual cleanup cost you?</h2>
              <p className={`text-[17px] ${muted}`}>Estimate based on about 2 minutes of manual work per product row, at $40/hour.</p>
            </div>
            <div className="min-w-0 flex-[1_1_480px] rounded-[18px] border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-2">
                <label htmlFor="rows" className="text-[15px] font-semibold">Product rows per month</label>
                <span className="text-[22px] font-extrabold text-blue-700 dark:text-blue-300">{rows.toLocaleString()}</span>
              </div>
              <input
                id="rows"
                type="range"
                min={500}
                max={50000}
                step={500}
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="h-6 w-full accent-blue-600 dark:accent-blue-400"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>500</span>
                <span>50,000</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className={`${card} p-4`}>
                  <div className={`text-[13px] ${muted}`}>Hours saved / month</div>
                  <div className="text-3xl font-extrabold tracking-tight">~{hours.toLocaleString()} hrs</div>
                </div>
                <div className={`${card} p-4`}>
                  <div className={`text-[13px] ${muted}`}>Labor cost saved / month</div>
                  <div className="text-3xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">${(hours * 40).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="scroll-mt-20 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
            <div className="mx-auto mb-12 max-w-[640px] text-center">
              <p className={eyebrow}>Pricing</p>
              <h2 className={`${h2} mb-3.5`}>Simple plans, priced by catalog size</h2>
              <p className={`text-[17px] ${muted}`}>Start free. Upgrade when your catalog grows. No setup fees.</p>
            </div>
            <div className="grid items-stretch gap-5 md:grid-cols-3">
              {PLANS.map((p) => (
                <div
                  key={p.name}
                  className={`relative flex flex-col gap-[18px] rounded-[18px] bg-white px-7 py-8 dark:bg-slate-900 ${
                    p.popular
                      ? 'border-2 border-blue-600 shadow-xl shadow-blue-600/20 dark:border-blue-400'
                      : 'border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3.5 left-7 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white dark:bg-blue-500">Most popular</span>
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{p.name}</h3>
                    <p className={`mt-1 text-sm ${muted}`}>{p.blurb}</p>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[44px] font-extrabold tracking-tight">{p.price}</span>
                    <span className={`text-sm ${muted}`}>/ month</span>
                  </div>
                  <div className="rounded-[10px] bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-500/15 dark:text-blue-200">{p.rows}</div>
                  <ul className="flex flex-1 flex-col gap-2.5 text-[15px]">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-blue-600 dark:text-blue-400" strokeWidth={2.6} />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.name === 'Enterprise' ? '/contact' : '/signup'}
                    className={`flex min-h-12 items-center justify-center rounded-xl text-[15px] font-bold transition ${
                      p.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400'
                        : 'border border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="scroll-mt-20 border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-[800px] px-4 py-24 sm:px-6">
            <h2 className={`${h2} mb-8 text-center`}>Questions, answered</h2>
            <div className="flex flex-col gap-3">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className={`${card} overflow-hidden`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-${i}`}
                      className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-[18px] text-left text-base font-semibold"
                    >
                      {f.q}
                      {open ? (
                        <Minus className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />
                      ) : (
                        <Plus className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />
                      )}
                    </button>
                    {open && (
                      <p id={`faq-${i}`} className={`animate-fade-in px-5 pb-5 text-[15px] ${muted}`}>
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="bg-[#0b2a63] dark:bg-[#0f2a5c]">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-4 py-20 sm:px-6">
            <div className="max-w-[620px]">
              <h2 className={`${h2} mb-3 text-white`}>Your next supplier file, import-ready in minutes.</h2>
              <p className="text-[17px] text-blue-100">Upload a CSV or Excel file and see the cleaned export before you pay anything.</p>
            </div>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-bold text-[#0b1a3a] transition hover:-translate-y-0.5"
            >
              Upload your file
              <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}
