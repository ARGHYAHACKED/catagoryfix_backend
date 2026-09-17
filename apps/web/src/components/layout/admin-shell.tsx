'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  ShieldAlert,
  Users,
  Building2,
  FileSpreadsheet,
  Download,
  Activity,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
  Search,
  Lock,
  Database,
  RefreshCw,
  CreditCard,
  EyeOff,
} from 'lucide-react';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: meData, error, isLoading } = useQuery<{ user: { systemRole: string; email: string } }>({
    queryKey: ['auth-me'],
    queryFn: () => api<{ user: { systemRole: string; email: string } }>('/auth/me'),
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (error || meData?.user?.systemRole !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [isLoading, error, meData, router]);

  const navigation = [
    { name: 'System Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Billing & Plans', href: '/admin/billing', icon: CreditCard },
    { name: 'Ignored Parameters', href: '/admin/ignored-parameters', icon: EyeOff },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Organizations', href: '/admin/organizations', icon: Building2 },
    { name: 'All CSV Imports', href: '/admin/imports', icon: FileSpreadsheet },
    { name: 'All Exports', href: '/admin/exports', icon: Download },
    { name: 'Audit & System Logs', href: '/admin/logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <img src="/logo_catalogfix.png" alt="CatalogFix" className="h-8 w-auto object-contain max-h-[34px] brightness-125" />
            </Link>
          </div>

          {/* Quick Exit to User Dashboard */}
          <div className="p-3">
            <Link
              href="/dashboard"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App Dashboard</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Status Footer */}
        <div className="p-4 border-t border-slate-900 space-y-3">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">System Status: Active</span>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/20 border border-rose-900/40 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-slate-200">System Admin Portal</span>
            <span>/</span>
            <span className="text-slate-400">Real-Time Data Supervision</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-full font-mono">
              Role: System Administrator
            </span>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
