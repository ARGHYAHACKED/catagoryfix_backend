'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal,
  Table as TableIcon,
  Search,
  ExternalLink,
  ArrowLeft,
  Cpu,
  BarChart3,
  Tag,
} from 'lucide-react';

type Mapping = { id?: string; sourceColumn: string; targetField: string; confidence: number };

export default function ImportDetailPage() {
  const organizationId = useOrgId();
  const params = useParams<{ id: string }>();
  const id = String(params.id ?? '');
  const qc = useQueryClient();
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const jobQuery = useQuery({
    queryKey: ['import', id, organizationId],
    queryFn: () => api<Record<string, unknown>>(`/imports/${id}`, { organizationId }),
    enabled: Boolean(organizationId && id),
    refetchInterval: (query) => {
      const status = (query.state.data as { status?: string } | undefined)?.status;
      return status && ['QUEUED', 'PARSING', 'PROCESSING', 'VALIDATING', 'UPLOADING'].includes(status)
        ? 2000
        : false;
    },
  });

  const columnsQuery = useQuery({
    queryKey: ['columns', id],
    queryFn: () =>
      api<{
        headers: string[];
        encoding: string;
        delimiter: string;
        sampleRows: Array<Record<string, string>>;
        targetFields: string[];
      }>(`/imports/${id}/columns`, { organizationId }),
    enabled: Boolean(jobQuery.data),
  });

  const mappingQuery = useQuery({
    queryKey: ['mappings', id],
    queryFn: () => api<Mapping[]>(`/imports/${id}/mappings`, { organizationId }),
    enabled: Boolean(jobQuery.data),
  });

  const productsQuery = useQuery({
    queryKey: ['products', id],
    queryFn: () =>
      api<{
        items: Array<{
          id: string;
          title: string;
          sku: string | null;
          status: string;
          price: string | null;
          vendor: string | null;
          issues: Array<{ severity: string }>;
          _count: { variants: number };
        }>;
      }>(`/imports/${id}/products`, { organizationId }),
    enabled: ['READY', 'COMPLETED'].includes(String((jobQuery.data as { status?: string } | undefined)?.status)),
  });

  const summaryQuery = useQuery({
    queryKey: ['summary', id],
    queryFn: () => api<Record<string, number>>(`/imports/${id}/validation-summary`, { organizationId }),
    enabled: productsQuery.isSuccess,
  });

  useEffect(() => {
    if (mappingQuery.data) setMappings(mappingQuery.data);
  }, [mappingQuery.data]);

  const saveMappings = useMutation({
    mutationFn: () =>
      api(`/imports/${id}/mappings`, {
        method: 'PUT',
        organizationId,
        body: JSON.stringify({
          mappings: mappings.map((m) => ({ sourceColumn: m.sourceColumn, targetField: m.targetField })),
        }),
      }),
  });

  const process = useMutation({
    mutationFn: async () => {
      await saveMappings.mutateAsync();
      return api(`/imports/${id}/process`, { method: 'POST', organizationId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['import', id] }),
  });

  const exportJob = useMutation({
    mutationFn: () =>
      api<{ id: string }>('/exports', {
        method: 'POST',
        organizationId,
        body: JSON.stringify({ importId: id, platform: 'SHOPIFY' }),
      }),
    onSuccess: (data) => {
      window.location.href = `/dashboard/exports/${data.id}`;
    },
  });

  const job = jobQuery.data as {
    name?: string;
    status?: string;
    progressPercentage?: number;
    currentStage?: string;
    totalRows?: number;
    processedRows?: number;
  } | undefined;

  const filteredProducts = (productsQuery.data?.items ?? []).filter((p) =>
    searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  const isProcessing = job?.status && ['QUEUED', 'PARSING', 'PROCESSING', 'VALIDATING'].includes(job.status);

  return (
    <DashboardShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4">
        <Link href="/dashboard/imports" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Imports
        </Link>
        <span>›</span>
        <span className="text-slate-600 truncate max-w-xs">{job?.name ?? 'Import Detail'}</span>
      </div>

      {/* Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job?.name ?? 'Import Catalog'}</h1>
            {job?.status && <StatusBadge status={job.status} />}
          </div>
          <p className="text-xs font-medium text-slate-500">
            {job?.currentStage ?? 'Initializing'} · {(job?.processedRows ?? 0).toLocaleString()} of {(job?.totalRows ?? 0).toLocaleString()} rows
          </p>
        </div>

        {['READY', 'COMPLETED'].includes(job?.status ?? '') && (
          <button
            onClick={() => exportJob.mutate()}
            disabled={exportJob.isPending}
            className="btn btn-success self-start sm:self-auto"
          >
            {exportJob.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Export…</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export Shopify CSV</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Processing Progress Bar */}
      {isProcessing && (
        <div className="card p-5 mb-6 border-indigo-100 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-indigo-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <Cpu className="h-4 w-4 text-indigo-600 animate-pulse" />
              </div>
              <span>{job?.currentStage ?? 'Processing catalog rows…'}</span>
            </div>
            <span className="text-sm font-bold text-indigo-600 tabular-nums">{job?.progressPercentage ?? 0}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${job?.progressPercentage ?? 0}%` }} />
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
            <span>Auto-refreshing every 2 seconds…</span>
          </div>
        </div>
      )}

      {/* Column Mapping Section */}
      {job?.status === 'MAPPING_REQUIRED' && (
        <section className="card mb-8 animate-fade-in-up overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </div>
                Column Mapping Wizard
              </h2>
              <p className="text-xs text-slate-400 mt-1 ml-9">
                Map supplier headers to standard Shopify product attributes.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              Encoding: <span className="text-slate-800">{columnsQuery.data?.encoding ?? 'utf-8'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Supplier Field</th>
                  <th>Destination Field</th>
                  <th>Sample Values</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((mapping, index) => (
                  <tr key={mapping.sourceColumn}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-900">{mapping.sourceColumn}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer min-w-[160px]"
                        value={mapping.targetField}
                        onChange={(e) => {
                          const next = [...mappings];
                          next[index] = { ...mapping, targetField: e.target.value };
                          setMappings(next);
                        }}
                      >
                        {(columnsQuery.data?.targetFields ?? []).map((field) => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-slate-500 italic max-w-[200px] truncate">
                      {(columnsQuery.data?.sampleRows ?? [])
                        .map((row) => row[mapping.sourceColumn])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(', ') || <span className="text-slate-300 not-italic">empty</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            style={{ width: `${(mapping.confidence ?? 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {Math.round((mapping.confidence ?? 0) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end p-4 border-t border-slate-100">
            <button
              onClick={() => process.mutate()}
              disabled={process.isPending}
              className="btn btn-primary"
            >
              {process.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Catalog…</span>
                </>
              ) : (
                <>
                  <span>Save Mapping &amp; Process</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Validation Summary */}
      {summaryQuery.data && (
        <section className="mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-900">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            Validation Summary
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Errors', value: summaryQuery.data.errors ?? 0, cls: 'bg-rose-50 border-rose-200 text-rose-900', valCls: 'text-rose-600' },
              { label: 'Warnings', value: summaryQuery.data.warnings ?? 0, cls: 'bg-amber-50 border-amber-200 text-amber-900', valCls: 'text-amber-600' },
              { label: 'Ready', value: summaryQuery.data.ready ?? 0, cls: 'bg-emerald-50 border-emerald-200 text-emerald-900', valCls: 'text-emerald-600' },
              { label: 'Duplicate SKUs', value: summaryQuery.data.duplicateSku ?? 0, cls: 'bg-orange-50 border-orange-200 text-orange-900', valCls: 'text-orange-600' },
              { label: 'Missing Images', value: summaryQuery.data.missingImages ?? 0, cls: 'bg-slate-50 border-slate-200 text-slate-800', valCls: 'text-slate-600' },
              { label: 'Missing Titles', value: summaryQuery.data.missingTitles ?? 0, cls: 'bg-slate-50 border-slate-200 text-slate-800', valCls: 'text-slate-600' },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${item.cls}`}>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{item.label}</div>
                <div className={`text-2xl font-extrabold ${item.valCls}`}>{item.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products Table */}
      {productsQuery.data && (
        <section className="card overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/40">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <TableIcon className="h-3.5 w-3.5" />
              </div>
              Catalog Products
              <span className="badge badge-neutral">{filteredProducts.length}</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by title or SKU…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs font-medium placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Title</th>
                  <th>SKU</th>
                  <th>Variants</th>
                  <th>Price</th>
                  <th>Vendor</th>
                  <th>Validation</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, i) => (
                  <tr key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <td><StatusBadge status={product.status} /></td>
                    <td>
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="flex items-center gap-1.5 font-semibold text-slate-900 hover:text-indigo-600 transition-colors group"
                      >
                        <span className="text-[13px]">{product.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity flex-shrink-0" />
                      </Link>
                    </td>
                    <td className="font-mono text-slate-600 text-[12px]">{product.sku || '—'}</td>
                    <td>
                      <span className="badge badge-neutral">{product._count.variants}</span>
                    </td>
                    <td className="font-semibold text-slate-900">{product.price ? `$${product.price}` : '—'}</td>
                    <td className="text-slate-500">{product.vendor || '—'}</td>
                    <td>
                      {product.issues.some((i) => i.severity === 'ERROR') ? (
                        <span className="badge badge-error">
                          <AlertCircle className="h-3 w-3" /> Error
                        </span>
                      ) : product.issues.some((i) => i.severity === 'WARNING') ? (
                        <span className="badge badge-warning">
                          <AlertTriangle className="h-3 w-3" /> Warning
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          <CheckCircle2 className="h-3 w-3" /> OK
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-all"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </DashboardShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isOk = ['COMPLETED', 'READY'].includes(status);
  const isErr = ['FAILED', 'INVALID'].includes(status);
  const isProcessing = ['QUEUED', 'PARSING', 'PROCESSING', 'VALIDATING'].includes(status);
  return (
    <span className={`badge ${isOk ? 'badge-success' : isErr ? 'badge-error' : 'badge-warning'}`}>
      <span className={`status-dot ${isOk ? 'bg-emerald-500' : isErr ? 'bg-rose-500' : 'bg-amber-500'} ${isProcessing ? 'processing' : ''}`} />
      {status}
    </span>
  );
}
