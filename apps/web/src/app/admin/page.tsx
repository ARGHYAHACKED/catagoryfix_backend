'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Building2,
  FileSpreadsheet,
  Download,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface SystemStats {
  users: { total: number };
  organizations: { total: number };
  imports: {
    total: number;
    completed: number;
    failed: number;
    totalRows: number;
    processedRows: number;
  };
  exports: { total: number };
  products: { total: number; valid: number; invalid: number };
  billing?: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    pastDueSubscriptions: number;
    cancelledSubscriptions: number;
    estimatedMRR: number;
    plans: {
      FREE: number;
      STARTER: number;
      BUSINESS: number;
      PRO: number;
    };
  };
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading, error, refetch } = useQuery<SystemStats>({
    queryKey: ['admin-stats'],
    queryFn: () => api<SystemStats>('/admin/stats'),
  });

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <span>System Admin Command Center</span>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Live Data
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring across all users, organizations, subscriptions, CSV imports, and store exports.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Stats</span>
          </button>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
            <span>Fetching real-time system statistics...</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/40 border border-rose-800 p-6 rounded-2xl text-rose-300 space-y-2">
            <h3 className="font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> Admin Access Notice
            </h3>
            <p className="text-sm">
              Failed to load admin stats. Make sure your account has system <code className="bg-slate-900 px-2 py-0.5 rounded text-rose-300">ADMIN</code> privileges.
            </p>
          </div>
        )}

        {stats && (
          <>
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* MRR & Billing */}
              <div className="bg-slate-950 border border-amber-500/30 p-5 rounded-2xl space-y-3 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Est. MRR</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">
                  ${stats.billing?.estimatedMRR ?? 0}<span className="text-xs text-slate-400 font-normal">/mo</span>
                </p>
                <Link
                  href="/admin/billing"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
                >
                  Manage Billing &rarr;
                </Link>
              </div>

              {/* Users */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">{stats.users.total}</p>
                <Link
                  href="/admin/users"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                >
                  Manage Users &rarr;
                </Link>
              </div>

              {/* Organizations */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Organizations</span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">{stats.organizations.total}</p>
                <Link
                  href="/admin/organizations"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                >
                  View Workspaces &rarr;
                </Link>
              </div>

              {/* Imports */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">CSV Imports</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">{stats.imports.total}</p>
                <Link
                  href="/admin/imports"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                >
                  Inspect Imports &rarr;
                </Link>
              </div>

              {/* Exports */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Store Exports</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">{stats.exports.total}</p>
                <Link
                  href="/admin/exports"
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
                >
                  View Feeds &rarr;
                </Link>
              </div>
            </div>

            {/* Plan Breakdown & Subscription Status */}
            {stats.billing && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    <span>Subscription Plan Breakdown & Billing Overview</span>
                  </h3>
                  <Link
                    href="/admin/billing"
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg bg-amber-500/10 transition-colors"
                  >
                    View All Subscriptions &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Free Tier</p>
                    <p className="text-2xl font-black text-white font-mono">{stats.billing.plans.FREE}</p>
                    <p className="text-[11px] text-slate-500">$0/mo</p>
                  </div>

                  <div className="bg-slate-900 border border-blue-900/40 p-4 rounded-xl space-y-1">
                    <p className="text-xs text-blue-400 font-semibold uppercase">Starter Plan</p>
                    <p className="text-2xl font-black text-blue-300 font-mono">{stats.billing.plans.STARTER}</p>
                    <p className="text-[11px] text-slate-500">$9/mo each</p>
                  </div>

                  <div className="bg-slate-900 border border-indigo-900/40 p-4 rounded-xl space-y-1">
                    <p className="text-xs text-indigo-400 font-semibold uppercase">Business Plan</p>
                    <p className="text-2xl font-black text-indigo-300 font-mono">{stats.billing.plans.BUSINESS}</p>
                    <p className="text-[11px] text-slate-500">$19/mo each</p>
                  </div>

                  <div className="bg-slate-900 border border-amber-900/40 p-4 rounded-xl space-y-1">
                    <p className="text-xs text-amber-400 font-semibold uppercase">Pro Plan</p>
                    <p className="text-2xl font-black text-amber-300 font-mono">{stats.billing.plans.PRO}</p>
                    <p className="text-[11px] text-slate-500">$49/mo each</p>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Row Volume & Product Processing Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Row Metrics */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span>Total Catalog Rows Volume</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Scanned CSV Rows</p>
                    <p className="text-2xl font-black text-white font-mono">
                      {stats.imports.totalRows.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Successfully Processed</p>
                    <p className="text-2xl font-black text-emerald-400 font-mono">
                      {stats.imports.processedRows.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Catalog Validation Stats */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Product Items & Validation Ratio</span>
                </h3>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                    <p className="text-[11px] text-slate-400">Total Items</p>
                    <p className="text-xl font-bold text-white font-mono">{stats.products.total}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                    <p className="text-[11px] text-emerald-400">Ready / Valid</p>
                    <p className="text-xl font-bold text-emerald-400 font-mono">
                      {stats.products.valid}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                    <p className="text-[11px] text-rose-400">Invalid / Flags</p>
                    <p className="text-xl font-bold text-rose-400 font-mono">
                      {stats.products.invalid}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
