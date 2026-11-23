'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
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

        </header>

        {/* Bottom padding on phones so content clears the bottom tab bar. */}
        <main className="mx-auto w-full max-w-[1280px] flex-1 p-4 pb-28 sm:p-6 sm:pb-28 md:pb-8 lg:p-8">{children}</main>
      </div>

      <MobileTabBar isActive={isActive} isAdmin={isAdmin} planLabel={planName(summary?.plan)} />
    </div>
  );
}

/* ───────────── Mobile: bottom tab bar + "Settings" sheet ───────────── */

/** Everything not on the tab bar lives in the Settings sheet. */
const SHEET_ITEMS = [
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/integrations', label: 'Integrations', icon: Plug },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Account settings', icon: Settings },
];

function MobileTabBar({
  isActive,
  isAdmin,
  planLabel,
}: {
  isActive: (item: (typeof NAV)[number]) => boolean;
  isAdmin: boolean;
  planLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the sheet on navigation and on Escape; lock page scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const tab = (href: string, exact = false) => isActive({ href, exact } as (typeof NAV)[number]);
  const sheetActive = SHEET_ITEMS.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));

  const tabClass = (active: boolean) =>
    `flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
      active ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'
    }`;

  return (
    <>
      <nav
        aria-label="Dashboard"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-md items-end px-2">
          <Link href="/dashboard" aria-current={tab('/dashboard', true) ? 'page' : undefined} className={tabClass(tab('/dashboard', true))}>
            <LayoutDashboard className="h-[22px] w-[22px]" />
            Overview
          </Link>
          <Link href="/dashboard/imports" aria-current={tab('/dashboard/imports') ? 'page' : undefined} className={tabClass(tab('/dashboard/imports') && pathname !== '/dashboard/imports/new')}>
            <FileSpreadsheet className="h-[22px] w-[22px]" />
            Imports
          </Link>

          {/* Primary action, raised above the bar */}
          <div className="flex flex-1 justify-center">
            <Link
              href="/dashboard/imports/new"
              aria-label="New import"
              className="-mt-6 mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/35 ring-4 ring-white transition active:scale-95 dark:bg-blue-500 dark:ring-slate-900"
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </Link>
          </div>

          <Link href="/dashboard/exports" aria-current={tab('/dashboard/exports') ? 'page' : undefined} className={tabClass(tab('/dashboard/exports'))}>
            <Download className="h-[22px] w-[22px]" />
            Exports
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={tabClass(open || sheetActive)}
          >
            <Settings className="h-[22px] w-[22px]" />
            Settings
          </button>
        </div>
      </nav>

      {/* Settings sheet */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Settings and more">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/50 animate-fade-in" />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-slate-200 bg-white px-4 pt-3 shadow-2xl animate-slide-up dark:border-slate-800 dark:bg-slate-900"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700" aria-hidden="true" />
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-base font-bold">Settings</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">{planLabel}</span>
            </div>

            <ul className="space-y-1">
              {SHEET_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors ${
                        active
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                          : 'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {isAdmin && (
                <li>
                  <Link href="/admin" className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    Admin panel
                  </Link>
                </li>
              )}
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 px-1 pt-3 dark:border-slate-800">
              <span className="flex items-center gap-3 text-[15px] font-medium">
                Appearance
              </span>
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-2 flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
