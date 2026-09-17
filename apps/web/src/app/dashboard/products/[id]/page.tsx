'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Package,
  Save,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Code2,
  ArrowLeft,
  Loader2,
  Tag,
  DollarSign,
  Building2,
  Sparkles,
} from 'lucide-react';

export default function ProductPage() {
  const organizationId = useOrgId();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState<string | null>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['product', params.id, organizationId],
    queryFn: () =>
      api<{
        id: string;
        title: string;
        sku: string | null;
        description: string | null;
        vendor: string | null;
        price: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        rawData: unknown;
        issues: Array<{ id: string; code: string; message: string; severity: string; resolved: boolean }>;
        variants: Array<{ id: string; sku: string | null; price: string | null; optionValues: Record<string, string> }>;
      }>(`/products/${params.id}`, { organizationId }),
    enabled: Boolean(organizationId && params.id),
  });

  const save = useMutation({
    mutationFn: () =>
      api(`/products/${params.id}`, {
        method: 'PATCH',
        organizationId,
        body: JSON.stringify({ title: title ?? data?.title }),
      }),
    onSuccess: () => refetch(),
  });

  if (isLoading || !data) {
    return (
      <DashboardShell>
        <div className="flex h-64 items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <span className="text-sm font-medium">Loading product details…</span>
        </div>
      </DashboardShell>
    );
  }

  const errorCount = data.issues.filter((i) => i.severity === 'ERROR').length;
  const warnCount = data.issues.filter((i) => i.severity === 'WARNING').length;

  return (
    <DashboardShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4">
        <button
          onClick={() => router.back()}
          className="hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </button>
        <span>›</span>
        <span className="text-slate-600 truncate max-w-xs">{data.title}</span>
      </div>

      {/* Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {data.sku && (
              <span className="flex items-center gap-1 font-mono bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs text-slate-700 font-semibold">
                <Tag className="h-3 w-3 text-slate-400" />
                {data.sku}
              </span>
            )}
            {data.vendor && (
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Building2 className="h-3 w-3 text-slate-400" />
                {data.vendor}
              </span>
            )}
            {data.price && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                <DollarSign className="h-3 w-3" />
                {data.price}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="btn btn-primary self-start"
        >
          {save.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Issue summary bar */}
      {data.issues.length > 0 && (
        <div className={`notification mb-6 animate-fade-in ${errorCount > 0 ? 'notification-error' : 'notification-warning'}`}>
          {errorCount > 0
            ? <AlertCircle className="h-4 w-4 flex-shrink-0" />
            : <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          }
          <div>
            <div className="font-semibold text-sm">
              {errorCount > 0 ? `${errorCount} error${errorCount > 1 ? 's' : ''}` : ''}{' '}
              {errorCount > 0 && warnCount > 0 ? '& ' : ''}{warnCount > 0 ? `${warnCount} warning${warnCount > 1 ? 's' : ''}` : ''} found
            </div>
            <div className="text-xs opacity-80 mt-0.5">Review and resolve issues before exporting to Shopify.</div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <section className="card p-6 animate-fade-in-up">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-5 pb-4 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <Package className="h-3.5 w-3.5" />
            </div>
            Basic Product Information
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Title</label>
              <input
                className="input text-[13px] font-semibold"
                value={title ?? data.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title…"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'SKU', value: data.sku || '—', icon: Tag, mono: true },
                { label: 'Vendor', value: data.vendor || '—', icon: Building2 },
                { label: 'Base Price', value: data.price ? `$${data.price}` : '—', icon: DollarSign },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                      <Icon className="h-3 w-3" />
                      {field.label}
                    </div>
                    <div className={`text-xs font-bold text-slate-900 ${field.mono ? 'font-mono' : ''}`}>
                      {field.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {data.description && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                  {data.description}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Validation Issues */}
        <section className="card p-6 animate-fade-in-up delay-100">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-5 pb-4 border-b border-slate-100">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${errorCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
            Audit &amp; Validation Issues
            <span className={`badge ${errorCount > 0 ? 'badge-error' : warnCount > 0 ? 'badge-warning' : 'badge-success'}`}>
              {data.issues.length}
            </span>
          </div>

          {data.issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="text-sm font-bold text-emerald-800 mb-1">All clear!</div>
              <div className="text-xs text-slate-400">No validation issues detected. Product is 100% compliant.</div>
            </div>
          ) : (
            <ul className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {data.issues.map((issue) => (
                <li
                  key={issue.id}
                  className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                    issue.severity === 'ERROR'
                      ? 'border-rose-200 bg-rose-50/80 text-rose-900'
                      : issue.severity === 'WARNING'
                        ? 'border-amber-200 bg-amber-50/80 text-amber-900'
                        : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  {issue.severity === 'ERROR' ? (
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] block opacity-75 mb-0.5">
                      {issue.severity}: {issue.code}
                    </span>
                    <span className="font-medium">{issue.message}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Variants */}
        <section className="card overflow-hidden animate-fade-in-up delay-200">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm p-5 pb-4 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <Layers className="h-3.5 w-3.5" />
            </div>
            Product Variants
            <span className="badge badge-neutral">{data.variants.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Variant SKU</th>
                  <th>Options</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {data.variants.map((v) => (
                  <tr key={v.id}>
                    <td className="font-mono font-semibold text-slate-900 text-[12px]">{v.sku || '—'}</td>
                    <td className="text-slate-500 text-[12px]">
                      {Object.entries(v.optionValues || {})
                        .map(([k, val]) => `${k}: ${val}`)
                        .join(' · ') || 'Default'}
                    </td>
                    <td className="font-bold text-slate-900">{v.price ? `$${v.price}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Raw Data */}
        <section className="card p-5 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm mb-4 pb-3 border-b border-slate-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Code2 className="h-3.5 w-3.5" />
            </div>
            Raw Supplier Data
          </div>
          <pre className="max-h-60 overflow-auto rounded-xl bg-slate-900 p-4 font-mono text-[11px] text-emerald-400 leading-relaxed">
            {JSON.stringify(data.rawData, null, 2)}
          </pre>
        </section>
      </div>

      {/* AI Enhancement strip */}
      <div className="mt-6 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-indigo-50/30 to-white p-4 flex items-center justify-between animate-fade-in-up delay-400">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm animate-pulse-slow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">AI Content Enhancement</div>
            <div className="text-[11px] text-slate-500">Auto-generate SEO titles &amp; descriptions with AI.</div>
          </div>
        </div>
        <button className="btn btn-primary text-[12px] py-2 px-4">
          <Sparkles className="h-3.5 w-3.5" />
          Enhance with AI
        </button>
      </div>
    </DashboardShell>
  );
}
