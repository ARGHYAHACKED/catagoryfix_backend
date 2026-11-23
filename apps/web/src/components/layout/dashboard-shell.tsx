'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Package,
  Download,
  Plug,
  Users,
  CreditCard,
  Settings,
  Plus,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/theme/theme';
import { useOrgId } from '@/hooks/use-org-id';
import { logout } from '@/lib/api';
import { UNLIMITED, initials, useDashboardSummary, useMe } from '@/lib/dashboard';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/imports', label: 'Imports', icon: FileSpreadsheet },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/exports', label: 'Exports', icon: Download },
  { href: '/dashboard/integrations', label: 'Integrations', icon: Plug },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function planName(plan?: string) {
  if (!plan) return 'Free plan';
  return `${plan.charAt(0)}${plan.slice(1).toLowerCase()} plan`;
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const organizationId = useOrgId();
  const { data: me } = useMe();
  const { data: summary } = useDashboardSummary(organizationId);

  const isAdmin = me?.user?.systemRole === 'ADMIN';
  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const used = summary?.productsProcessed ?? 0;
  const limit = summary?.monthlyLimit ?? UNLIMITED;
  const unlimited = limit >= UNLIMITED;
  const usagePct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(1, limit)) * 100));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
      {/* ── Sidebar (desktop) ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <Link href="/dashboard" className="flex h-16 items-center px-5" aria-label="CatalogFix dashboard">
          <Logo className="h-7" />
        </Link>

        <div className="px-4 pb-3 space-y-2">
          <Link
            href="/dashboard/imports/new"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            <Plus className="h-4 w-4" />
            New import
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 text-[13px] font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              <ShieldAlert className="h-4 w-4" />
              Admin panel
            </Link>
          )}
        </div>

        <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
                  active
                    ? 'bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                    : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold">{planName(summary?.plan)}</span>
              <span className="text-slate-500 dark:text-slate-400">{unlimited ? 'Unlimited' : `${usagePct}%`}</span>
            </div>
            <div className="mt-2.5 mb-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-[width] duration-1000 ease-out"
                style={{ width: `${unlimited ? Math.min(100, used > 0 ? 100 : 0) : usagePct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {used.toLocaleString()} {unlimited ? 'rows processed this month' : `of ${limit.toLocaleString()} rows this month`}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex min-h-screen flex-col md:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Link href="/dashboard" className="md:hidden" aria-label="CatalogFix dashboard">
              <Logo className="h-6" />
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/dashboard/imports/new"
                className="hidden h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-[13px] font-semibold text-white transition hover:bg-blue-500 sm:flex md:hidden dark:bg-blue-500"
              >
                <Plus className="h-4 w-4" />
                New import
              </Link>
              <ThemeToggle />
              <Link
                href="/dashboard/settings"
                aria-label={`Account settings for ${me?.user?.name || me?.user?.email || 'your account'}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-sm font-bold text-white"
              >
                {initials(me?.user?.name, me?.user?.email)}
              </Link>
            </div>
          </div>

          {/* Mobile nav: horizontal, scrollable */}
          <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
            {NAV.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium ${
                    active
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-[1280px] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
