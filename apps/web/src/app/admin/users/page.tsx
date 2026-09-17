'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  Mail,
  UserCheck,
} from 'lucide-react';

interface UserItem {
  id: string;
  email: string;
  name: string;
  status: string;
  systemRole?: string;
  createdAt: string;
  memberships: Array<{
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery<{ users: UserItem[]; total: number }>({
    queryKey: ['admin-users', searchTerm],
    queryFn: () => api<{ users: UserItem[]; total: number }>(`/admin/users?search=${encodeURIComponent(searchTerm)}`),
  });

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'USER' | 'ADMIN' }) => {
      return api(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ systemRole: newRole }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string; newStatus: 'ACTIVE' | 'SUSPENDED' }) => {
      return api(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-rose-500" />
              <span>User Management</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View and manage system permissions, roles, and status for all registered users.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
            <span>Loading user directory...</span>
          </div>
        )}

        {/* Users Table */}
        {data && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Organizations</th>
                    <th className="p-4">System Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {data.users.map((user) => {
                    const isAdmin = user.systemRole === 'ADMIN' || user.email === 'admin@catalogfix.io';
                    const isSuspended = user.status === 'SUSPENDED';

                    return (
                      <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white uppercase">
                              {user.name ? user.name[0] : user.email[0]}
                            </div>
                            <div>
                              <p className="font-bold text-white">{user.name || 'Unnamed User'}</p>
                              <p className="text-slate-400 text-[11px] font-mono">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          {user.memberships && user.memberships.length > 0 ? (
                            <div className="space-y-1">
                              {user.memberships.map((m, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded text-[11px]"
                                >
                                  <Building2 className="w-3 h-3 text-cyan-400" />
                                  {m.organization.name}
                                  <span className="text-slate-500 font-mono text-[10px]">({m.role})</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">No Organization</span>
                          )}
                        </td>

                        <td className="p-4">
                          {isAdmin ? (
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-rose-400" /> ADMIN
                            </span>
                          ) : (
                            <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-medium">
                              USER
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {isSuspended ? (
                            <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              SUSPENDED
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE
                            </span>
                          )}
                        </td>

                        <td className="p-4 font-mono text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right space-x-2">
                          {/* Role Toggle Button */}
                          <button
                            onClick={() =>
                              toggleRoleMutation.mutate({
                                userId: user.id,
                                newRole: isAdmin ? 'USER' : 'ADMIN',
                              })
                            }
                            disabled={toggleRoleMutation.isPending}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            {isAdmin ? 'Demote to USER' : 'Make ADMIN'}
                          </button>

                          {/* Status Toggle Button */}
                          <button
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                userId: user.id,
                                newStatus: isSuspended ? 'ACTIVE' : 'SUSPENDED',
                              })
                            }
                            disabled={toggleStatusMutation.isPending}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                              isSuspended
                                ? 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800'
                                : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800'
                            }`}
                          >
                            {isSuspended ? 'Unsuspend' : 'Suspend'}
                          </button>
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
