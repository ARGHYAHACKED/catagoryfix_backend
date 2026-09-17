'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { FileSpreadsheet, Building2, User, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ImportItem {
  id: string;
  name: string;
  status: string;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  createdAt: string;
  organization: { id: string; name: string };
  createdBy: { id: string; email: string; name: string };
  files: Array<{ originalName: string; fileSize: number }>;
  _count: { products: number; issues: number };
}

export default function AdminImportsPage() {
  const { data, isLoading } = useQuery<{ imports: ImportItem[]; total: number }>({
    queryKey: ['admin-imports'],
    queryFn: () => api<{ imports: ImportItem[]; total: number }>('/admin/imports'),
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <span>All CSV Imports Across System</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global view of all uploaded CSV supplier catalogs, row processing metrics, and error rates.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Fetching CSV imports...</span>
          </div>
        )}

        {data && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Import Name & File</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total Rows</th>
                    <th className="p-4">Processed / Success</th>
                    <th className="p-4">Issues</th>
                    <th className="p-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {data.imports.map((imp) => {
                    const isCompleted = imp.status === 'COMPLETED';
                    const isFailed = imp.status === 'FAILED';

                    return (
                      <tr key={imp.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-white flex items-center gap-2">
                              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                              {imp.name}
                            </p>
                            <p className="text-slate-500 text-[11px] font-mono">
                              {imp.files[0]?.originalName || 'raw_catalog.csv'}
                            </p>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg text-xs">
                            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                            {imp.organization.name}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-mono text-[11px]">{imp.createdBy.email}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          {isCompleted ? (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> COMPLETED
                            </span>
                          ) : isFailed ? (
                            <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-500" /> FAILED
                            </span>
                          ) : (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" /> {imp.status}
                            </span>
                          )}
                        </td>

                        <td className="p-4 font-mono font-bold text-white">{imp.totalRows}</td>

                        <td className="p-4 font-mono">
                          <span className="text-emerald-400 font-bold">{imp.successfulRows}</span> /{' '}
                          <span className="text-slate-400">{imp.processedRows}</span>
                        </td>

                        <td className="p-4">
                          {imp._count.issues > 0 ? (
                            <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                              {imp._count.issues} issues
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">0 issues</span>
                          )}
                        </td>

                        <td className="p-4 font-mono text-slate-400">
                          {new Date(imp.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
