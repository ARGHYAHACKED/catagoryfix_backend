'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FileSpreadsheet, Plus, ArrowRight, Loader2, Search, Filter, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ImportsPage() {
  const organizationId = useOrgId();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['imports', organizationId],
    queryFn: () =>
      api<{ items: Array<{ id: string; name: string; status: string; totalRows: number; createdAt?: string }> }>('/imports', {
        organizationId,
      }),
    enabled: Boolean(organizationId),
  });

  const items = (data?.items ?? []).filter((i) =>
    search ? i.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Catalog Imports</h1>
          <p className="text-sm text-slate-500 mt-1">Manage uploaded CSV and Excel supplier product files.</p>
        </div>
        <Link
          href="/dashboard/imports/new"
          className="btn btn-primary self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Import
        </Link>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden animate-fade-in-up">
        {/* Table toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2.5 font-semibold text-slate-900 text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <FileSpreadsheet className="h-3.5 w-3.5" />
            </div>
            <span>Catalog Files</span>
            <span className="badge badge-neutral">{items.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search imports…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs font-medium placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center">
            <Loader2 className="h-7 w-7 animate-spin mx-auto text-indigo-500 mb-3" />
            <div className="text-sm font-medium text-slate-500">Loading imports…</div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <div className="text-base font-semibold text-slate-700 mb-1">
              {search ? 'No matching imports' : 'No imports yet'}
            </div>
            <div className="text-sm text-slate-400 mb-6">
              {search ? 'Try a different search term.' : 'Upload your first supplier CSV or Excel catalog.'}
            </div>
            {!search && (
              <Link href="/dashboard/imports/new" className="btn btn-primary">
                <Plus className="h-4 w-4" />
                New Import
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Status</th>
                  <th>Total Rows</th>
                  <th>Created</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <td>
                      <Link
                        href={`/dashboard/imports/${item.id}`}
                        className="flex items-center gap-2.5 hover:text-indigo-600 transition-colors group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-500 group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-[13px]">
                          {item.name}
                        </span>
                      </Link>
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <span className="text-slate-700 font-medium">{item.totalRows.toLocaleString()} rows</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="h-3 w-3" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/dashboard/imports/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all"
                      >
                        Open
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
