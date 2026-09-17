'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Download, Loader2, Calendar, ArrowRight, FileDown, CheckCircle2 } from 'lucide-react';

export default function ExportsPage() {
  const organizationId = useOrgId();
  const { data, isLoading } = useQuery({
    queryKey: ['exports', organizationId],
    queryFn: () =>
      api<
        Array<{
          id: string;
          platform: string;
          status: string;
          createdAt: string;
        }>
      >('/exports', { organizationId }),
    enabled: Boolean(organizationId),
  });

  return (
    <DashboardShell>
      {/* Header */}
      <div className="page-header flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/30">
            <Download className="h-[18px] w-[18px]" />
          </div>
          Generated Exports
        </h1>
        <p className="text-sm text-slate-500 ml-12">
          Download Shopify-formatted CSV files generated from your catalog imports.
        </p>
      </div>

      {/* Exports Table Card */}
      <div className="card overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <FileDown className="h-3.5 w-3.5" />
            </div>
            Export History
            <span className="badge badge-neutral">{(data ?? []).length}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center">
            <Loader2 className="h-7 w-7 animate-spin mx-auto text-violet-500 mb-3" />
            <div className="text-sm font-medium text-slate-500">Loading export history…</div>
          </div>
        ) : (data ?? []).length === 0 ? (
          <div className="p-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
              <Download className="h-8 w-8" />
            </div>
            <div className="text-base font-semibold text-slate-700 mb-1">No exports yet</div>
            <div className="text-sm text-slate-400 mb-1">
              Process an import and click <span className="font-semibold text-slate-600">Export Shopify CSV</span>.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Generated At</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((item, i) => (
                  <tr key={item.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <td>
                      <Link
                        href={`/dashboard/exports/${item.id}`}
                        className="flex items-center gap-2.5 font-semibold text-slate-900 hover:text-violet-600 transition-colors group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 border border-violet-100 text-violet-500 group-hover:bg-violet-100 transition-colors flex-shrink-0">
                          <Download className="h-3.5 w-3.5" />
                        </div>
                        <span>{item.platform} Export</span>
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/dashboard/exports/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 border border-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-all"
                      >
                        <Download className="h-3 w-3" />
                        Download
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
