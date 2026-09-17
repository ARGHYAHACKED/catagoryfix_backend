'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Download, Building2, User, CheckCircle2, Loader2 } from 'lucide-react';

interface ExportItem {
  id: string;
  platform: string;
  status: string;
  totalProducts: number;
  processedProducts: number;
  createdAt: string;
  organization: { name: string };
  createdBy: { email: string };
  files: Array<{ fileName: string; fileSize: number }>;
}

export default function AdminExportsPage() {
  const { data, isLoading } = useQuery<{ exports: ExportItem[]; total: number }>({
    queryKey: ['admin-exports'],
    queryFn: () => api<{ exports: ExportItem[]; total: number }>('/admin/exports'),
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Download className="w-6 h-6 text-purple-400" />
            <span>All Store Exports</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Global list of generated export CSV feeds for Shopify, WooCommerce, and custom store targets.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <span>Fetching generated exports...</span>
          </div>
        )}

        {data && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Export File</th>
                    <th className="p-4">Target Platform</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Products Exported</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Generated Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {data.exports.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">
                        {exp.files[0]?.fileName || `export_${exp.id.slice(0, 8)}.csv`}
                      </td>
                      <td className="p-4">
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold">
                          {exp.platform}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{exp.organization?.name}</td>
                      <td className="p-4 font-mono text-slate-400">{exp.createdBy?.email}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">{exp.totalProducts}</td>
                      <td className="p-4">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {exp.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        {new Date(exp.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
