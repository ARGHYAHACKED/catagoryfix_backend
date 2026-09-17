'use client';

import { useState } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Loader2,
  DollarSign,
  Zap,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface SubscriptionItem {
  id: string;
  organizationId: string;
  plan: 'FREE' | 'STARTER' | 'BUSINESS' | 'PRO';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIALING' | 'EXPIRED';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    members: Array<{
      role: string;
      user: {
        email: string;
        name: string;
      };
    }>;
  };
}

export default function AdminBillingPage() {
  const queryClient = useQueryClient();
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('ALL');

  const { data, isLoading } = useQuery<{ subscriptions: SubscriptionItem[]; total: number }>({
    queryKey: ['admin-subscriptions'],
    queryFn: () => api<{ subscriptions: SubscriptionItem[]; total: number }>('/admin/subscriptions'),
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({
      subscriptionId,
      newPlan,
    }: {
      subscriptionId: string;
      newPlan: 'FREE' | 'STARTER' | 'BUSINESS' | 'PRO';
    }) => {
      return api(`/admin/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ plan: newPlan }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const filteredSubscriptions = data?.subscriptions.filter((sub) => {
    if (selectedPlanFilter === 'ALL') return true;
    return sub.plan === selectedPlanFilter;
  });

  const planPrices = {
    FREE: 0,
    STARTER: 9,
    BUSINESS: 19,
    PRO: 49,
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-amber-500" />
              <span>Billing & Subscriptions Supervision</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor active SaaS plans, Stripe customer IDs, subscription status, and manage organization plan tiers.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 border border-slate-800 rounded-xl text-xs">
            {['ALL', 'FREE', 'STARTER', 'BUSINESS', 'PRO'].map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlanFilter(plan)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedPlanFilter === plan
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span>Loading billing and subscription registry...</span>
          </div>
        )}

        {/* Table */}
        {filteredSubscriptions && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Organization & Contact</th>
                    <th className="p-4">Plan Tier</th>
                    <th className="p-4">Price / Mo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Stripe Ref</th>
                    <th className="p-4">Period Dates</th>
                    <th className="p-4 text-right">Admin Plan Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        No subscriptions found matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => {
                      const owner = sub.organization.members.find((m) => m.role === 'OWNER') || sub.organization.members[0];

                      return (
                        <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                          {/* Org */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 font-bold uppercase">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-white">{sub.organization.name}</p>
                                <p className="text-slate-400 text-[11px] font-mono">
                                  {owner?.user?.email || 'No contact email'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="p-4">
                            {sub.plan === 'PRO' && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-amber-400" /> PRO
                              </span>
                            )}
                            {sub.plan === 'BUSINESS' && (
                              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
                                BUSINESS
                              </span>
                            )}
                            {sub.plan === 'STARTER' && (
                              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
                                STARTER
                              </span>
                            )}
                            {sub.plan === 'FREE' && (
                              <span className="bg-slate-900 text-slate-400 border border-slate-800 px-3 py-1 rounded-full text-[11px] font-medium">
                                FREE
                              </span>
                            )}
                          </td>

                          {/* Price */}
                          <td className="p-4 font-mono font-bold text-white">
                            ${planPrices[sub.plan]}
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {sub.status === 'ACTIVE' ? (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ACTIVE
                              </span>
                            ) : sub.status === 'PAST_DUE' ? (
                              <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
                                PAST DUE
                              </span>
                            ) : (
                              <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-full text-[11px]">
                                {sub.status}
                              </span>
                            )}
                          </td>

                          {/* Stripe */}
                          <td className="p-4 font-mono text-[11px] text-slate-400">
                            {sub.stripeCustomerId ? (
                              <div>
                                <p className="text-slate-300 truncate max-w-[120px]">{sub.stripeCustomerId}</p>
                                {sub.stripeSubscriptionId && (
                                  <p className="text-slate-500 text-[10px] truncate max-w-[120px]">
                                    {sub.stripeSubscriptionId}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600 italic">No Stripe ID</span>
                            )}
                          </td>

                          {/* Dates */}
                          <td className="p-4 font-mono text-[11px] text-slate-400">
                            {sub.currentPeriodEnd ? (
                              <span>
                                Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                              </span>
                            ) : (
                              <span>Joined {new Date(sub.createdAt).toLocaleDateString()}</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right space-x-1">
                            {(['FREE', 'STARTER', 'BUSINESS', 'PRO'] as const).map((p) => (
                              <button
                                key={p}
                                disabled={sub.plan === p || updatePlanMutation.isPending}
                                onClick={() =>
                                  updatePlanMutation.mutate({
                                    subscriptionId: sub.id,
                                    newPlan: p,
                                  })
                                }
                                className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                                  sub.plan === p
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 cursor-default'
                                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
