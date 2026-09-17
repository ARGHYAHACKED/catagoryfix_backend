'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Check, Sparkles, Zap, ShieldCheck, Activity, TrendingUp, Star } from 'lucide-react';

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: '$0',
    period: 'Forever free',
    highlight: false,
    features: [
      'Unlimited CSV Imports',
      'Shopify CSV Exporting',
      'Multi-variant grouping',
      'Auto column detection',
      'Validation dashboard',
    ],
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: '$9',
    period: 'per month',
    highlight: true,
    badge: 'Popular',
    features: [
      '250 products / month',
      'Shopify Store Integration',
      'Basic AI Content Generation',
      'Bulk operations',
      'Email Support',
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: '$19',
    period: 'per month',
    highlight: false,
    features: [
      '10,000 products / month',
      'Advanced AI Enhancement',
      'Direct Shopify Publishing',
      'Priority Support',
      'Custom field mapping',
    ],
  },
];

export default function BillingPage() {
  const organizationId = useOrgId();
  const { data: subscription } = useQuery({
    queryKey: ['billing', organizationId],
    queryFn: () => api<{ plan: string; status: string }>('/billing/subscription', { organizationId }),
    enabled: Boolean(organizationId),
  });
  const usage = useQuery({
    queryKey: ['usage', organizationId],
    queryFn: () =>
      api<{ plan: string; usage: { productsProcessed: number } }>('/usage/current', { organizationId }),
    enabled: Boolean(organizationId),
  });

  const currentPlan = subscription?.plan ?? usage.data?.plan ?? 'FREE';

  return (
    <DashboardShell>
      {/* Header */}
      <div className="page-header flex flex-col gap-1.5 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
            <CreditCard className="h-[18px] w-[18px]" />
          </div>
          Subscription &amp; Billing
        </h1>
        <p className="text-sm text-slate-500 ml-12">Manage your workspace plan and usage quotas.</p>
      </div>

      {/* Current Plan Status */}
      <div className="card p-6 mb-8 animate-fade-in-up max-w-2xl">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Current Plan</div>
              <div className="text-xl font-extrabold text-slate-900">{currentPlan}</div>
            </div>
          </div>
          <span className="badge badge-success">
            <ShieldCheck className="h-3.5 w-3.5" />
            Unlimited Dev Access
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              <div className="text-xs font-bold text-slate-500">Products Processed</div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {usage.data?.usage.productsProcessed?.toLocaleString() ?? 0}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="h-3 w-3" />
              All-time total
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <div className="text-xs font-bold text-slate-500">Import Limit</div>
            </div>
            <div className="text-2xl font-extrabold text-indigo-600">Unlimited</div>
            <div className="text-[11px] text-slate-400 mt-1">Dev & local access</div>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="animate-fade-in-up delay-200">
        <div className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          Available Plans
        </div>
        <div className="grid gap-5 md:grid-cols-3 max-w-4xl">
          {PLANS.map((plan, i) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all animate-fade-in-up card-interactive ${
                  plan.highlight
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-gradient-to-b from-white to-indigo-50/30'
                    : isCurrent
                      ? 'border-emerald-300 ring-2 ring-emerald-500/15 bg-white'
                      : 'bg-white'
                }`}
                style={{ animationDelay: `${i * 100 + 300}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{plan.name}</span>
                    <div className="flex gap-1.5">
                      {plan.badge && (
                        <span className="badge badge-brand">{plan.badge}</span>
                      )}
                      {isCurrent && (
                        <span className="badge badge-success">Active</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-400 ml-1.5">{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isCurrent}
                  className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : plan.highlight
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 hover:-translate-y-0.5'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
