'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Sparkles, ArrowRight, User, Building2, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = ['Your Details', 'Workspace', 'Access'];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await api<{ organization: { id: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, organizationName }),
      });
      localStorage.setItem('cf_org', result.organization.id);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Check your password (min 10 chars).');
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 flex items-center justify-center p-6 antialiased">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30 mb-4 animate-float">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-1">Create Your Workspace</h1>
          <p className="text-sm text-slate-500">Turn supplier catalogs into Shopify-ready products.</p>
        </div>

        {/* Form card */}
        <div className="card p-8 animate-scale-in">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    className="input pl-10"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Workspace Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    className="input pl-10"
                    placeholder="My Store Catalog"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="input pl-10"
                  placeholder="jane@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
                <span className="ml-1.5 text-[10px] font-normal text-slate-400">(minimum 10 characters)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="input pl-10"
                  placeholder="••••••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={10}
                />
              </div>
              {password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        password.length >= 10 ? 'bg-emerald-500 w-full' :
                        password.length >= 6 ? 'bg-amber-500 w-2/3' : 'bg-rose-400 w-1/3'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold ${
                    password.length >= 10 ? 'text-emerald-600' :
                    password.length >= 6 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {password.length >= 10 ? 'Strong' : password.length >= 6 ? 'Fair' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="notification notification-error animate-fade-in">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">{error}</span>
              </div>
            )}

            <button
              disabled={busy}
              className="btn btn-primary w-full justify-center text-sm py-3 mt-2"
              type="submit"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Workspace…</span>
                </>
              ) : (
                <>
                  <span>Create Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 pt-1">
              Already registered?{' '}
              <Link className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors" href="/login">
                Log in
              </Link>
            </p>
          </form>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {['No credit card required', 'Free forever', 'Secure & private'].map((item) => (
            <div key={item} className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
