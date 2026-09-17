'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import {
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface IgnoredParameter {
  id: string;
  name: string;
  slug: string;
  category: 'Pricing' | 'Metafields' | 'Logistics' | 'Compliance' | 'Taxation';
  defaultBehavior: 'Ignored by Default';
  reason: string;
  commonHeaders: string[];
  enabled: boolean;
}

const INITIAL_IGNORED_PARAMETERS: IgnoredParameter[] = [
  {
    id: 'param-1',
    name: 'Cost Price / Wholesale Cost',
    slug: 'cost_per_item',
    category: 'Pricing',
    defaultBehavior: 'Ignored by Default',
    reason: 'Prevents exposing internal wholesale cost data to public storefront product feeds.',
    commonHeaders: ['whsl_cost', 'cost_price', 'ek_preis', 'unit_cost_usd'],
    enabled: false,
  },
  {
    id: 'param-2',
    name: 'Harmonized System (HS) Code',
    slug: 'hs_code',
    category: 'Compliance',
    defaultBehavior: 'Ignored by Default',
    reason: 'Customs tariff codes vary by destination country and require verification.',
    commonHeaders: ['hs_code', 'tariff_no', 'customs_code', 'stat_number'],
    enabled: false,
  },
  {
    id: 'param-3',
    name: 'Custom Supplier Metafields',
    slug: 'custom_metafields',
    category: 'Metafields',
    defaultBehavior: 'Ignored by Default',
    reason: 'Unstructured JSON metadata can fail schema validation if format is non-standard.',
    commonHeaders: ['metafield_json', 'extra_attrs', 'custom_data', 'spec_sheet'],
    enabled: false,
  },
  {
    id: 'param-4',
    name: 'Google Product Category (GPC)',
    slug: 'google_product_category',
    category: 'Compliance',
    defaultBehavior: 'Ignored by Default',
    reason: 'Requires exact taxonomy ID match according to Google Merchant specs.',
    commonHeaders: ['gpc_id', 'google_cat', 'merchant_category'],
    enabled: false,
  },
  {
    id: 'param-5',
    name: 'Tax Code & Exemption Groups',
    slug: 'tax_code',
    category: 'Taxation',
    defaultBehavior: 'Ignored by Default',
    reason: 'Tax codes are regional; automated mapping without override can lead to tax compliance issues.',
    commonHeaders: ['tax_class', 'vat_rate', 'tax_code_us'],
    enabled: false,
  },
  {
    id: 'param-6',
    name: 'Fulfillment Service & Location Code',
    slug: 'fulfillment_service',
    category: 'Logistics',
    defaultBehavior: 'Ignored by Default',
    reason: 'Warehouse location codes must match active store inventory location IDs exactly.',
    commonHeaders: ['wh_location', 'fulfillment_center', 'loc_code'],
    enabled: false,
  },
  {
    id: 'param-7',
    name: 'Barcode / EAN / GTIN / ISBN',
    slug: 'barcode',
    category: 'Logistics',
    defaultBehavior: 'Ignored by Default',
    reason: 'Validation is required to ensure GTIN checksum formatting is strictly valid.',
    commonHeaders: ['ean_code', 'upc', 'gtin_13', 'isbn_no'],
    enabled: false,
  },
];

export default function AdminIgnoredParametersPage() {
  const [parameters, setParameters] = useState<IgnoredParameter[]>(INITIAL_IGNORED_PARAMETERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const toggleParameter = (id: string) => {
    setParameters((prev) =>
      prev.map((param) => (param.id === id ? { ...param, enabled: !param.enabled } : param))
    );
  };

  const filtered = parameters.filter((param) => {
    const matchesSearch =
      param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      param.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      param.commonHeaders.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || param.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <EyeOff className="w-6 h-6 text-rose-500" />
              <span>Default Ignored Parameters</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Bypass Registry
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Parameters and custom supplier columns that are ignored by default during automated CSV mapping. You can enable them for global auto-mapping one by one.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 border border-slate-800 rounded-xl text-xs">
            {['ALL', 'Pricing', 'Compliance', 'Metafields', 'Taxation', 'Logistics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notice Info Box */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white">Why are these parameters ignored by default?</p>
            <p className="text-slate-400 leading-relaxed">
              To guarantee 100% store import success, non-standard columns (like wholesale cost or unformatted tariff codes) are safe-bypassed unless explicitly whitelisted below. Enriched parameters can be added to your global mapping rules anytime.
            </p>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search parameter, slug, or header..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <span className="text-white font-bold">{filtered.length}</span> of {parameters.length} parameters
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((param) => (
            <div
              key={param.id}
              className={`bg-slate-950 border p-5 rounded-2xl space-y-4 transition-all ${
                param.enabled
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{param.name}</h3>
                    <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded">
                      {param.slug}
                    </span>
                  </div>
                  <span className="inline-block mt-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {param.category}
                  </span>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleParameter(param.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                    param.enabled
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {param.enabled ? 'Whitelisted / Enabled' : 'Ignored (Default)'}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{param.reason}</p>

              {/* Sample Supplier Headers */}
              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Bypassed Supplier Headers:</span>
                <div className="flex flex-wrap gap-1">
                  {param.commonHeaders.map((header) => (
                    <span
                      key={header}
                      className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded font-mono"
                    >
                      {header}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
