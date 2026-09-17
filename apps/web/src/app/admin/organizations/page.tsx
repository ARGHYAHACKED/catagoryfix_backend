'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, FileSpreadsheet, Download, Loader2, CreditCard } from 'lucide-react';

interface OrgItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
  };
  _count: {
    members: number;
    imports: number;
    exports: number;
  };
}

export default function AdminOrganizationsPage() {
  const { data, isLoading } = useQuery<{ organizations: OrgItem[]; total: number }>({
    queryKey: ['admin-organizations'],
    queryFn: () => api<{ organizations: OrgItem[]; total: number }>('/admin/organizations'),
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <span>Organizations & Workspaces</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview of all active customer organizations, member counts, subscription plans, and CSV usage.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Loading organizations...</span>
          </div>
        )}

        {data && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Plan & Subscription</th>
                    <th className="p-4">Members</th>
                    <th className="p-4">Imports</th>
                    <th className="p-4">Exports</th>
                    <th className="p-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {data.organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center font-bold text-cyan-300">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{org.name}</p>
                            <p className="text-slate-500 text-[11px] font-mono">{org.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-slate-400">{org.slug}</td>

                      <td className="p-4">
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {org.subscription?.plan || 'FREE'} ({org.subscription?.status || 'ACTIVE'})
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-white">{org._count.members}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">{org._count.imports}</td>
                      <td className="p-4 font-mono font-bold text-purple-400">{org._count.exports}</td>

                      <td className="p-4 font-mono text-slate-400">
                        {new Date(org.createdAt).toLocaleDateString()}
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
