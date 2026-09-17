'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Download, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Package, FileText } from 'lucide-react';

export default function ExportDetailPage() {
  const organizationId = useOrgId();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const exportId = String(params.id ?? '');

  const { data, isLoading } = useQuery({
    queryKey: ['export', exportId],
    queryFn: () =>
      api<{ id: string; status: string; platform: string; totalProducts: number; errorMessage?: string }>(`/exports/${exportId}`, {
        organizationId,
      }),
    enabled: Boolean(organizationId && exportId),
    refetchInterval: (q) =>
      q.state.data?.status === 'COMPLETED' || q.state.data?.status === 'FAILED' ? false : 2000,
  });

  async function download() {
    const result = await api<{ url: string; fileName: string }>(`/exports/${exportId}/download`, {
      organizationId,
    });
    window.location.href = result.url;
  }

  if (isLoading || !data) {
    return (
      <DashboardShell>
        <div className="flex h-64 items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          <span className="text-sm font-medium">Loading export details…</span>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4">
        <button
          onClick={() => router.push('/dashboard/exports')}
          className="hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Exports
        </button>
        <span>›</span>
        <span className="text-slate-600">{data.platform} Export</span>
      </div>

      {/* Header */}
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{data.platform} Export</h1>
          <p className="mt-1 text-sm text-slate-500">
            {data.totalProducts?.toLocaleString() ?? 0} Shopify-compliant product rows exported.
          </p>
        </div>
        {data.status === 'COMPLETED' && (
          <button onClick={download} className="btn btn-success self-start sm:self-auto">
            <Download className="h-4 w-4" />
            <span>Download Shopify CSV</span>
          </button>
        )}
      </div>

      {/* Status Card */}
      <div className="max-w-2xl animate-scale-in">
        <div className="card p-10 text-center">
          {data.status === 'COMPLETED' ? (
            <>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto mb-5 shadow-sm">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Export File Ready!</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
                This CSV is formatted for direct import into your{' '}
                <span className="font-semibold text-slate-700">Shopify Admin → Products → Import</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <button
                  onClick={download}
                  className="btn btn-success text-sm py-3 px-8"
                >
                  <Download className="h-5 w-5" />
                  Download Ready CSV
                </button>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-left">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Export Details</div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Platform', value: data.platform, icon: FileText },
                    { label: 'Products', value: data.totalProducts?.toLocaleString() ?? '—', icon: Package },
                    { label: 'Status', value: 'COMPLETED', icon: CheckCircle2 },
                    { label: 'Format', value: 'Shopify CSV v2', icon: FileText },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</div>
                          <div className="text-xs font-semibold text-slate-800">{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : data.status === 'FAILED' ? (
            <>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 mx-auto mb-5">
                <AlertCircle className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-extrabold text-rose-900 mb-2">Export Generation Failed</h2>
              <p className="text-sm text-rose-600 max-w-sm mx-auto">
                {data.errorMessage || 'An error occurred during CSV generation. Please try again.'}
              </p>
            </>
          ) : (
            <>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 mx-auto mb-5">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Building Export File…</h2>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                Generating your Shopify CSV. This usually takes a few seconds.
              </p>
              <div className="progress-bar-track max-w-xs mx-auto">
                <div className="progress-bar-fill" style={{ width: '60%' }} />
              </div>
              <div className="text-xs text-slate-400 mt-3">Auto-refreshing every 2 seconds…</div>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
