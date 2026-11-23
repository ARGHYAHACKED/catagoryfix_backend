'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, FileSpreadsheet, Loader2, Plus, Search, XCircle } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/dashboard';

type ImportItem = { id: string; name: string; status: string; totalRows: number; createdAt?: string };

/** Statuses where the import hasn't finished, so it can still be stopped. */
const CANCELLABLE = ['CREATED', 'UPLOADING', 'UPLOADED', 'QUEUED', 'PARSING', 'MAPPING_REQUIRED', 'PROCESSING', 'VALIDATING'];
const ACTIVE = ['UPLOADED', 'QUEUED', 'PARSING', 'PROCESSING', 'VALIDATING'];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'In progress' },
  { id: 'review', label: 'Needs action' },
  { id: 'done', label: 'Done' },
  { id: 'stopped', label: 'Failed / cancelled' },
] as const;
type FilterId = (typeof FILTERS)[number]['id'];

function matchesFilter(status: string, filter: FilterId) {
  switch (filter) {
    case 'active':
      return ['CREATED', 'UPLOADING', ...ACTIVE].includes(status);
    case 'review':
      return status === 'MAPPING_REQUIRED';
    case 'done':
      return ['READY', 'COMPLETED'].includes(status);
    case 'stopped':
      return ['FAILED', 'CANCELLED'].includes(status);
    default:
      return true;
  }
}

export default function ImportsPage() {
  const organizationId = useOrgId();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterId>('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['imports', organizationId],
    queryFn: () => api<{ items: ImportItem[] }>('/imports', { organizationId }),
    enabled: Boolean(organizationId),
    // Keep statuses fresh while anything is still running.
    refetchInterval: (query) => (query.state.data?.items.some((i) => ACTIVE.includes(i.status)) ? 4000 : false),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => api(`/imports/${id}/cancel`, { method: 'POST', organizationId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['imports'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  function confirmCancel(item: ImportItem) {
    if (window.confirm(`Stop “${item.name}”? It will be marked as cancelled.`)) cancel.mutate(item.id);
  }

  const all = data?.items ?? [];
  const items = all.filter(
    (i) => matchesFilter(i.status, filter) && (search ? i.name.toLowerCase().includes(search.toLowerCase()) : true),
  );

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Imports</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Supplier CSV and Excel files you&apos;ve uploaded.</p>
        </div>
        <Link
          href="/dashboard/imports/new"
          className="hidden h-11 items-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-500 sm:inline-flex sm:self-auto dark:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          New import
        </Link>
      </div>

      {/* Search + filters */}
      <div className="mb-4 flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
        <label className="relative block sm:max-w-sm">
          <span className="sr-only">Search imports</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name…"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <div role="tablist" aria-label="Filter imports" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => {
            const count = all.filter((i) => matchesFilter(i.status, f.id)).length;
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f.id)}
                className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                  on
                    ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
                <span className={`tabular-nums ${on ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {cancel.isError && (
        <div role="alert" className="notification notification-error mb-4">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{cancel.error instanceof Error ? cancel.error.message : 'Could not cancel the import.'}</span>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="skeleton block h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">Couldn&apos;t load imports. Refresh the page to try again.</p>
        ) : items.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <FileSpreadsheet className="h-7 w-7" />
            </span>
            <p className="mb-1 font-semibold">{all.length === 0 ? 'No imports yet' : 'Nothing matches'}</p>
            <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
              {all.length === 0 ? 'Upload a supplier file to get started.' : 'Try another filter or search term.'}
            </p>
            {all.length === 0 && (
              <Link href="/dashboard/imports/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white dark:bg-blue-500">
                <Plus className="h-4 w-4" /> New import
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Phones: cards */}
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 sm:hidden">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 p-4">
                  <Link href={`/dashboard/imports/${item.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                      <FileSpreadsheet className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{item.name}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <StatusBadge status={item.status} />
                        <span>{item.totalRows ? `${item.totalRows.toLocaleString()} rows` : 'No rows yet'}</span>
                        <span>· {timeAgo(item.createdAt)}</span>
                      </span>
                    </span>
                  </Link>
                  {CANCELLABLE.includes(item.status) && (
                    <CancelButton compact busy={cancel.isPending && cancel.variables === item.id} onClick={() => confirmCancel(item)} />
                  )}
                </li>
              ))}
            </ul>

            {/* Tablet & desktop: table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="px-5 py-3">File</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Rows</th>
                    <th className="px-3 py-3">Uploaded</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                      <td className="max-w-[320px] px-5 py-3">
                        <Link href={`/dashboard/imports/${item.id}`} className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                            <FileSpreadsheet className="h-4 w-4" />
                          </span>
                          <span className="truncate font-semibold hover:underline">{item.name}</span>
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-3 py-3 tabular-nums text-slate-700 dark:text-slate-300">{item.totalRows ? item.totalRows.toLocaleString() : '–'}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600 dark:text-slate-400">{timeAgo(item.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          {CANCELLABLE.includes(item.status) && (
                            <CancelButton busy={cancel.isPending && cancel.variables === item.id} onClick={() => confirmCancel(item)} />
                          )}
                          <Link
                            href={`/dashboard/imports/${item.id}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                          >
                            Open <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </DashboardShell>
  );
}

function CancelButton({ onClick, busy, compact = false }: { onClick: () => void; busy: boolean; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label="Cancel import"
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-rose-300 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10 ${
        compact ? 'h-10 w-10' : 'h-9 px-3'
      }`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
      {!compact && (busy ? 'Cancelling…' : 'Cancel')}
    </button>
  );
}

const STATUS_STYLE: Record<string, { label: string; cls: string; live?: boolean }> = {
  CREATED: { label: 'Created', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  UPLOADING: { label: 'Uploading', cls: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', live: true },
  UPLOADED: { label: 'Uploaded', cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300', live: true },
  QUEUED: { label: 'Queued', cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300', live: true },
  PARSING: { label: 'Reading file', cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300', live: true },
  PROCESSING: { label: 'Processing', cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300', live: true },
  VALIDATING: { label: 'Validating', cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300', live: true },
  MAPPING_REQUIRED: { label: 'Needs mapping', cls: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  READY: { label: 'Ready', cls: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
  COMPLETED: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
  FAILED: { label: 'Failed', cls: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { label: status, cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${s.live ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
}
