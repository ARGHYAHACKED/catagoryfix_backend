'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  PackageCheck,
  Zap,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  ArrowUpRight,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const organizationId = useOrgId();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', organizationId],
    queryFn: () =>
      api<{
        productsProcessed: number;
        plan: string;
        monthlyLimit: number;
        recentImports: Array<{ id: string; name: string; status: string; createdAt?: string }>;
        recentExports: Array<{ id: string; status: string; platform: string; createdAt?: string }>;
        errorsRequiringAttention: number;
        productsReadyToExport: number;
        aiGenerations: number;
      }>('/dashboard/summary', { organizationId }),
    enabled: Boolean(organizationId),
  });

  const stats = [
    {
      icon: PackageCheck,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      label: 'Products Processed',
      value: data?.productsProcessed ?? 0,
      sub: 'Total catalog items processed',
      trend: '+12% this week',
      trendUp: true,
    },
    {
      icon: Zap,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      label: 'Plan',
      value: data?.plan ?? 'FREE',
      sub: 'Unlimited dev access',
      badge: 'Active',
    },
    {
      icon: AlertTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      label: 'Needs Attention',
      value: data?.errorsRequiringAttention ?? 0,
      sub: 'Validation errors to fix',
    },
    {
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      label: 'Ready to Export',
      value: data?.productsReadyToExport ?? 0,
      sub: 'Shopify-formatted products',
    },
  ];

  return (
    <DashboardShell>
      {/* Page header */}
      <div className="page-header mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor your catalog transformations, errors, and exports.
          </p>
        </div>
        <Link
          href="/dashboard/imports/new"
          className="btn btn-primary self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Import
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`card card-interactive p-5 animate-fade-in-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {stat.badge && (
                  <span className="badge badge-brand">{stat.badge}</span>
                )}
                {stat.trendUp && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
                {typeof stat.value === 'number'
                  ? isLoading ? <span className="skeleton h-8 w-16 block" /> : stat.value.toLocaleString()
                  : isLoading ? <span className="skeleton h-8 w-20 block" /> : stat.value
                }
              </div>
              <div className="text-xs font-semibold text-slate-700 mb-0.5">{stat.label}</div>
              <div className="text-[11px] text-slate-400">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Recent Imports */}
        <div className="card animate-fade-in-up delay-300">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <FileSpreadsheet className="h-3.5 w-3.5" />
              </div>
              Recent Imports
            </div>
            <Link
              href="/dashboard/imports"
              className="flex items-center gap-1 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="p-2">
            {isLoading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="skeleton h-9 w-9 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <div className="skeleton h-3.5 w-32 rounded" />
                      <div className="skeleton h-3 w-20 rounded" />
                    </div>
                    <div className="skeleton h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (data?.recentImports ?? []).length === 0 ? (
              <div className="p-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-slate-600 mb-1">No imports yet</div>
                <div className="text-xs text-slate-400 mb-4">Upload your first supplier catalog to get started.</div>
                <Link href="/dashboard/imports/new" className="btn btn-primary text-[12px] py-2 px-4">
                  <Plus className="h-3.5 w-3.5" />
                  New Import
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {(data?.recentImports ?? []).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 flex-shrink-0">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/dashboard/imports/${item.id}`}
                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate block"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="h-3 w-3" />
                        Catalog File
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Exports */}
        <div className="card animate-fade-in-up delay-400">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <Download className="h-3.5 w-3.5" />
              </div>
              Recent Exports
            </div>
            <Link
              href="/dashboard/exports"
              className="flex items-center gap-1 text-[12px] font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="p-2">
            {isLoading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="skeleton h-9 w-9 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <div className="skeleton h-3.5 w-32 rounded" />
                      <div className="skeleton h-3 w-20 rounded" />
                    </div>
                    <div className="skeleton h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (data?.recentExports ?? []).length === 0 ? (
              <div className="p-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
                  <Download className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-slate-600 mb-1">No exports yet</div>
                <div className="text-xs text-slate-400">Process an import to generate Shopify CSV exports.</div>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {(data?.recentExports ?? []).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50/80 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 flex-shrink-0">
                      <Download className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-slate-900">{item.platform} Export</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">Shopify Compliant CSV</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* AI Strip */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-violet-50/40 to-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up delay-500">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 animate-pulse-slow flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">AI Content Enhancer</div>
            <div className="text-xs text-slate-500 mt-0.5">Automatically improve product titles &amp; descriptions with AI.</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-indigo-100 rounded-xl px-3.5 py-2 shadow-xs">
            <Activity className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-bold text-indigo-700">{data?.aiGenerations ?? 0}</span>
            <span className="text-xs text-slate-500">generations</span>
          </div>
          <button className="btn btn-primary text-[12px] py-2 px-4">
            <Sparkles className="h-3.5 w-3.5" />
            Run AI Enhancement
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isOk = ['COMPLETED', 'READY'].includes(status);
  const isErr = ['FAILED', 'INVALID'].includes(status);
  const isProcessing = ['QUEUED', 'PARSING', 'PROCESSING', 'VALIDATING'].includes(status);

  return (
    <span
      className={`badge ${
        isOk ? 'badge-success' : isErr ? 'badge-error' : 'badge-warning'
      }`}
    >
      <span
        className={`status-dot ${
          isOk ? 'bg-emerald-500' : isErr ? 'bg-rose-500' : 'bg-amber-500'
        } ${isProcessing ? 'processing' : ''}`}
      />
      {status}
    </span>
  );
}
