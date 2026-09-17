'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  'Auto-detect CSV columns & encoding',
  'Multi-variant product grouping',
  'Shopify-compliant CSV export',
  'AI-powered content enhancement',
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await api<{ user?: { systemRole?: string }; organizations: Array<{ id: string }> }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const orgId = result.organizations[0]?.id;
      if (orgId) localStorage.setItem('cf_org', orgId);

      if (result.user?.systemRole === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 flex antialiased">
      {/* Left illustration panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">CatalogFix</span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight mb-4">
            Turn messy supplier<br />catalogs into<br />Shopify-ready products.
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed mb-10">
            Upload any CSV or Excel file, map your columns, fix errors, and export a clean Shopify product catalog in minutes.
          </p>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-indigo-100">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-indigo-300">
          © 2026 CatalogFix. Built for Shopify merchants.
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md">
              <Sparkles className="h-4.5 w-[18px]" />
            </div>
            <span className="text-lg font-bold text-slate-900">CatalogFix</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to your CatalogFix workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="input pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="input pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="notification notification-error animate-fade-in">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              disabled={busy}
              className="btn btn-primary w-full justify-center text-sm py-3"
              type="submit"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 pt-1">
              Don't have an account?{' '}
              <Link className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors" href="/signup">
                Create a workspace
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
