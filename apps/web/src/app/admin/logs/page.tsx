'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Activity, ShieldAlert, Loader2 } from 'lucide-react';

interface AuditItem {
  id: string;
  event: string;
  metadata?: any;
  createdAt: string;
  user?: { email: string };
  organization?: { name: string };
}

export default function AdminLogsPage() {
  const { data, isLoading } = useQuery<{ logs: AuditItem[]; total: number }>({
    queryKey: ['admin-logs'],
    queryFn: () => api<{ logs: AuditItem[]; total: number }>('/admin/audit-logs'),
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-rose-500" />
            <span>Audit & System Logs</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time audit log of system events, logins, org creations, and catalog operations.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
            <span>Fetching audit log history...</span>
          </div>
        )}

        {data && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Event Type</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {data.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-900 text-rose-300 border border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono">
                          {log.event}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-300">{log.user?.email || 'System'}</td>
                      <td className="p-4 text-slate-300">{log.organization?.name || 'N/A'}</td>
                      <td className="p-4 font-mono text-slate-400 max-w-xs truncate">
                        {log.metadata ? JSON.stringify(log.metadata) : '-'}
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
