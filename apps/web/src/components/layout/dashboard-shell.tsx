'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Download,
  CreditCard,
  Settings,
  Plus,
  Sparkles,
  Bell,
  User,
  Package,
  LogOut,
  ChevronRight,
  Zap,
  ShieldAlert,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/imports', label: 'Imports', icon: FileSpreadsheet },
  { href: '/dashboard/exports', label: 'Exports', icon: Download },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { data: meData } = useQuery<{ user: { systemRole: string; email: string } }>({
    queryKey: ['auth-me'],
    queryFn: () => api<{ user: { systemRole: string; email: string } }>('/auth/me'),
    retry: false,
  });

  const isAdmin = meData?.user?.systemRole === 'ADMIN';

  const isActive = (item: (typeof NAV)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">

      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] bg-white border-r border-slate-100 md:flex flex-col z-30 shadow-sm">

        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 group"
        >
          <img src="/logo_catalogfix.png" alt="CatalogFix" className="h-8 w-auto object-contain max-h-[34px]" />
        </Link>

        {/* Quick action */}
        <div className="px-4 pt-4 pb-3 space-y-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-2.5 px-4 text-[13px] font-bold text-white shadow-md shadow-rose-500/25 hover:from-rose-500 hover:to-amber-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>System Admin Panel</span>
            </Link>
          )}

          <Link
            href="/dashboard/imports/new"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 px-4 text-[13px] font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/35 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Import</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">Navigation</div>
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? 'active' : ''}`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 transition-colors ${
                  active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 text-indigo-400 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-4 space-y-3">
          {/* Plan badge */}
          <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-indigo-900 leading-none mb-0.5">Free Plan</div>
              <div className="text-[10px] text-indigo-500 font-medium truncate">Unlimited dev access</div>
            </div>
          </div>

          {/* System status */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-slate-600">All systems operational</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="md:pl-[240px] flex flex-col min-h-screen">

        {/* Top header */}
        <header className="sticky top-0 z-20 h-[60px] flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md px-6 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile logo placeholder */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-sm text-slate-900">CatalogFix</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Bell */}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 border border-white" />
            </button>

            {/* New import CTA */}
            <Link
              href="/dashboard/imports/new"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-[12px] font-semibold text-white shadow-sm shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Import</span>
            </Link>

            <div className="w-px h-5 bg-slate-200" />

            {/* User avatar */}
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 text-slate-600 hover:border-slate-300 transition-all">
              <User className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1280px] w-full mx-auto animate-fade-in">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-100 bg-white px-6 py-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>CatalogFix · Shopify Catalog Operations Platform</span>
          <span>© 2026</span>
        </footer>
      </div>
    </div>
  );
}
