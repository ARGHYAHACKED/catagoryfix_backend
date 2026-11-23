'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Layers,
  Package,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { issueLabel, timeAgo, useDashboardSummary, useMe, type ActiveImport } from '@/lib/dashboard';

/* ───────────────────────── animation helpers ───────────────────────── */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Animates from the previous value to `target` with an ease-out curve. */
function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const startValue = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(startValue + (target - startValue) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return Math.round(value);
}

/** True one frame after mount — lets bars/meters transition from 0 to their real size. */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function percentChange(current: number, previous?: number | null): string | null {
  if (previous === null || previous === undefined || previous <= 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}%`;
}

/* ───────────────────────────── page ───────────────────────────── */

export default function DashboardPage() {
  const organizationId = useOrgId();
  const { data, isLoading, isError } = useDashboardSummary(organizationId);
  const { data: me } = useMe();
  const firstName = (me?.user?.name ?? '').trim().split(/\s+/)[0];

  const running = data?.activeImport ? 1 : 0;
  const needMapping = data?.importsNeedingMapping ?? 0;
  const statusLine =
    running || needMapping
      ? [running ? '1 import is running' : null, needMapping ? `${needMapping} ${needMapping === 1 ? 'file needs' : 'files need'} column mapping` : null]
          .filter(Boolean)
          .join(' · ')
      : 'Everything is up to date.';

  const productsDelta = percentChange(data?.productsProcessed ?? 0, data?.productsProcessedLastMonth);
  const exportsDiff =
    data?.exportsCompletedLastMonth !== undefined && data?.exportsCompletedThisMonth !== undefined && data.exportsCompletedLastMonth > 0
      ? data.exportsCompletedThisMonth - data.exportsCompletedLastMonth
      : null;

  return (
    <DashboardShell>
      {/* Greeting */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">
            {greeting()}
            {firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{isLoading ? 'Loading your workspace…' : statusLine}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/exports"
            className="inline-flex h-11 items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            View exports
          </Link>
          <Link
            href="/dashboard/imports/new"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            <Upload className="h-4 w-4" />
            Upload file
          </Link>
        </div>
      </div>

      {isError && (
        <div role="alert" className="notification notification-error mb-6">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Couldn&apos;t load your dashboard data. Refresh the page to try again.</span>
        </div>
      )}

      {/* KPIs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          index={0}
          loading={isLoading}
          label="Products processed this month"
          value={data?.productsProcessed ?? 0}
          icon={Package}
          tone="blue"
          delta={productsDelta}
          deltaNote="vs last month"
        />
        <Kpi
          index={1}
          loading={isLoading}
          label="Errors needing attention"
          value={data?.errorsRequiringAttention ?? 0}
          icon={AlertTriangle}
          tone={(data?.errorsRequiringAttention ?? 0) > 0 ? 'amber' : 'green'}
          note={(data?.errorsRequiringAttention ?? 0) > 0 ? 'Fix before exporting' : 'Nothing blocking exports'}
        />
        <Kpi
          index={2}
          loading={isLoading}
          label="Products ready to export"
          value={data?.productsReadyToExport ?? 0}
          icon={CheckCircle2}
          tone="green"
          note="Validated and clean"
        />
        <Kpi
          index={3}
          loading={isLoading}
          label="Exports this month"
          value={data?.exportsCompletedThisMonth ?? 0}
          icon={Download}
          tone="blue"
          delta={exportsDiff === null ? null : `${exportsDiff >= 0 ? '+' : ''}${exportsDiff}`}
          deltaNote="vs last month"
        />
      </div>

      {/* Live import + issues */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <LiveImport active={data?.activeImport ?? null} needMapping={needMapping} loading={isLoading} />
        <IssuesCard issues={data?.issuesByCode ?? []} loading={isLoading} />
      </div>

      {/* Chart + recent imports */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <RowsChart days={data?.rowsByDay ?? []} loading={isLoading} />
        <RecentImports items={data?.recentImports ?? []} loading={isLoading} />
      </div>

      <RecentExports items={data?.recentExports ?? []} loading={isLoading} />
    </DashboardShell>
  );
}

/* ───────────────────────────── cards ───────────────────────────── */

const TONES = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
} as const;

const cardClass =
  'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-fade-in-up';

function Kpi({
  index,
  loading,
  label,
  value,
  icon: Icon,
  tone,
  delta,
  deltaNote,
  note,
}: {
  index: number;
  loading: boolean;
  label: string;
  value: number;
  icon: LucideIcon;
  tone: keyof typeof TONES;
  delta?: string | null;
  deltaNote?: string;
  note?: string;
}) {
  const shown = useCountUp(loading ? 0 : value);
  const negative = delta?.startsWith('-');
  return (
    <div className={`${cardClass} flex flex-col gap-2 p-5`} style={{ animationDelay: `${index * 70}ms` }}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-400">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      {loading ? (
        <span className="skeleton block h-9 w-24" />
      ) : (
        <span className="text-3xl font-extrabold tracking-tight tabular-nums">{shown.toLocaleString()}</span>
      )}
      <div className="min-h-[18px] text-xs">
        {delta ? (
          <>
            <span className={`font-bold ${negative ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>{delta}</span>{' '}
            <span className="text-slate-500 dark:text-slate-400">{deltaNote}</span>
          </>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">{note ?? 'No data from last month yet'}</span>
        )}
      </div>
    </div>
  );
}

const PIPELINE = ['Upload', 'Parse', 'Map', 'Validate', 'Ready'];
const STATUS_STEP: Record<string, number> = { UPLOADED: 0, QUEUED: 0, PARSING: 1, PROCESSING: 2, VALIDATING: 3 };

function LiveImport({ active, needMapping, loading }: { active: ActiveImport | null; needMapping: number; loading: boolean }) {
  const mounted = useMounted();
  const progress = active ? Math.max(0, Math.min(100, active.progressPercentage)) : 0;
  const step = active ? STATUS_STEP[active.status] ?? 0 : 0;

  return (
    <section aria-label="Import in progress" className={`${cardClass} flex flex-col gap-5 p-5`} style={{ animationDelay: '200ms' }}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold">Live import</h2>
        <Link href="/dashboard/imports" className="text-[13px] font-semibold text-blue-700 hover:underline dark:text-blue-300">
          All imports
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          <span className="skeleton block h-5 w-2/3" />
          <span className="skeleton block h-3 w-full" />
        </div>
      ) : active ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <Link href={`/dashboard/imports/${active.id}`} className="block truncate font-semibold hover:underline">
                  {active.name}
                </Link>
                <p className="text-[13px] text-slate-600 dark:text-slate-400">
                  {active.totalRows > 0 ? `${active.totalRows.toLocaleString()} rows · ` : ''}Export to{' '}
                  {active.targetPlatform.charAt(0) + active.targetPlatform.slice(1).toLowerCase()}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </span>
              {active.currentStage || PIPELINE[step]}
            </span>
          </div>

          <ol className="grid grid-cols-5 gap-2">
            {PIPELINE.map((label, i) => (
              <li key={label} className="flex flex-col gap-1.5">
                <span className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <span
                    className={`block h-full rounded-full bg-blue-600 transition-[width] duration-700 ease-out dark:bg-blue-400 ${i === step ? 'animate-pulse' : ''}`}
                    style={{ width: mounted ? (i < step ? '100%' : i === step ? '55%' : '0%') : '0%' }}
                  />
                </span>
                <span className={`text-xs ${i <= step ? 'font-semibold' : 'text-slate-500 dark:text-slate-500'}`}>{label}</span>
              </li>
            ))}
          </ol>

          <div>
            <div className="mb-2 flex justify-between text-[13px]">
              <span className="text-slate-600 dark:text-slate-400">
                {active.totalRows > 0
                  ? `${active.processedRows.toLocaleString()} of ${active.totalRows.toLocaleString()} rows`
                  : 'Reading file…'}
              </span>
              <span className="font-bold tabular-nums">{progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-[width] duration-1000 ease-out"
                style={{ width: `${mounted ? progress : 0}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-start justify-center gap-3 py-4">
          <p className="text-[15px] text-slate-600 dark:text-slate-400">
            No import is running right now.
            {needMapping > 0 && (
              <>
                {' '}
                <Link href="/dashboard/imports" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">
                  {needMapping} {needMapping === 1 ? 'file is' : 'files are'} waiting for column mapping.
                </Link>
              </>
            )}
          </p>
          <Link
            href="/dashboard/imports/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 dark:bg-blue-500"
          >
            <Upload className="h-4 w-4" />
            Upload a supplier file
          </Link>
        </div>
      )}
    </section>
  );
}

const BAR_COLORS = ['bg-blue-600', 'bg-emerald-500', 'bg-cyan-600', 'bg-amber-500', 'bg-rose-500'];

function IssuesCard({ issues, loading }: { issues: Array<{ code: string; count: number }>; loading: boolean }) {
  const mounted = useMounted();
  const max = Math.max(1, ...issues.map((i) => i.count));
  return (
    <section aria-label="Issues found this month" className={`${cardClass} flex flex-col gap-4 p-5`} style={{ animationDelay: '260ms' }}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold">Issues found this month</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">by type</span>
      </div>
      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <span key={i} className="skeleton block h-6 w-full" />
          ))}
        </div>
      ) : issues.length === 0 ? (
        <p className="py-6 text-[15px] text-slate-600 dark:text-slate-400">
          No validation issues this month. Upload a file and anything that would break an import shows up here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {issues.map((issue, i) => (
            <li key={issue.code}>
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span>{issueLabel(issue.code)}</span>
                <span className="font-bold tabular-nums">{issue.count.toLocaleString()}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-[width] duration-1000 ease-out`}
                  style={{ width: mounted ? `${(issue.count / max) * 100}%` : '0%', transitionDelay: `${150 + i * 80}ms` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RowsChart({ days, loading }: { days: Array<{ date: string; rows: number }>; loading: boolean }) {
  const mounted = useMounted();
  const total = days.reduce((sum, d) => sum + d.rows, 0);
  const shownTotal = useCountUp(loading ? 0 : total);
  const max = Math.max(1, ...days.map((d) => d.rows));
  const fmtDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <section aria-label="Rows imported in the last 14 days" className={`${cardClass} flex flex-col gap-4 p-5`} style={{ animationDelay: '320ms' }}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-bold">Rows imported</h2>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">Last 14 days</p>
        </div>
        <span className="text-2xl font-extrabold tabular-nums">{loading ? '–' : shownTotal.toLocaleString()}</span>
      </div>

      {loading ? (
        <span className="skeleton block h-[180px] w-full" />
      ) : total === 0 ? (
        <p className="flex h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-[13px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No imports in the last 14 days
        </p>
      ) : (
        <>
          <div className="flex h-[180px] items-end gap-1.5 border-b border-slate-200 dark:border-slate-800">
            {days.map((d, i) => {
              const last = i === days.length - 1;
              return (
                <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end">
                  <div
                    className={`rounded-t-md transition-[height] duration-700 ease-out ${
                      last ? 'bg-gradient-to-t from-blue-600 to-emerald-500' : 'bg-blue-600/60 group-hover:bg-blue-600 dark:bg-blue-400/50 dark:group-hover:bg-blue-400'
                    }`}
                    style={{ height: mounted ? `${Math.max(d.rows > 0 ? 3 : 0, (d.rows / max) * 100)}%` : '0%', transitionDelay: `${i * 35}ms` }}
                  />
                  <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                    {fmtDay(d.date)}: {d.rows.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{days[0] ? fmtDay(days[0].date) : ''}</span>
            <span>{days[7] ? fmtDay(days[7].date) : ''}</span>
            <span>Today</span>
          </div>
          {/* Same data for screen readers */}
          <table className="sr-only">
            <caption>Rows imported per day</caption>
            <tbody>
              {days.map((d) => (
                <tr key={d.date}>
                  <th scope="row">{fmtDay(d.date)}</th>
                  <td>{d.rows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

function statusInfo(status: string) {
  if (['COMPLETED', 'READY'].includes(status)) return { label: status === 'READY' ? 'Ready' : 'Completed', cls: TONES.green, live: false };
  if (['FAILED', 'CANCELLED'].includes(status))
    return { label: status === 'FAILED' ? 'Failed' : 'Cancelled', cls: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300', live: false };
  if (status === 'MAPPING_REQUIRED') return { label: 'Needs mapping', cls: TONES.amber, live: false };
  if (['UPLOADED', 'QUEUED', 'PARSING', 'PROCESSING', 'VALIDATING'].includes(status)) return { label: 'Processing', cls: TONES.blue, live: true };
  return { label: status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' '), cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', live: false };
}

function StatusBadge({ status }: { status: string }) {
  const s = statusInfo(status);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${s.live ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
}

function RecentImports({ items, loading }: { items: Array<{ id: string; name: string; status: string; totalRows?: number; createdAt?: string }>; loading: boolean }) {
  return (
    <section aria-label="Recent imports" className={`${cardClass} overflow-hidden`} style={{ animationDelay: '380ms' }}>
      <div className="flex items-baseline justify-between px-5 pb-3 pt-5">
        <h2 className="text-base font-bold">Recent imports</h2>
        <Link href="/dashboard/imports" className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-700 hover:underline dark:text-blue-300">
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3 px-5 pb-5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="skeleton block h-10 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="px-5 pb-8 pt-4 text-center">
          <FileSpreadsheet className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">No imports yet. Upload your first supplier file to get started.</p>
          <Link href="/dashboard/imports/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white dark:bg-blue-500">
            <Upload className="h-4 w-4" /> New import
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400">
                <th className="px-5 py-2 font-semibold">File</th>
                <th className="px-3 py-2 font-semibold">Rows</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-5 py-2 text-right font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 animate-fade-in"
                  style={{ animationDelay: `${450 + i * 60}ms` }}
                >
                  <td className="max-w-[220px] px-5 py-3">
                    <Link href={`/dashboard/imports/${item.id}`} className="block truncate font-semibold hover:underline">
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 tabular-nums text-slate-700 dark:text-slate-300">{item.totalRows ? item.totalRows.toLocaleString() : '–'}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right text-slate-600 dark:text-slate-400">{timeAgo(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function RecentExports({ items, loading }: { items: Array<{ id: string; status: string; platform: string; createdAt?: string }>; loading: boolean }) {
  if (!loading && items.length === 0) return null;
  return (
    <section aria-label="Recent exports" className={`${cardClass} p-5`} style={{ animationDelay: '440ms' }}>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-bold">Recent exports</h2>
        <Link href="/dashboard/exports" className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-700 hover:underline dark:text-blue-300">
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {loading ? (
        <span className="skeleton block h-10 w-full" />
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/dashboard/exports/${item.id}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  <Layers className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {item.platform.charAt(0) + item.platform.slice(1).toLowerCase()} export
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" /> {timeAgo(item.createdAt)}
                  </span>
                </span>
                <StatusBadge status={item.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
