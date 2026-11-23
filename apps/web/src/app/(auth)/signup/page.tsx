'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, User, Building2, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { AuthShell, AuthField } from '@/components/layout/auth-shell';

function strength(length: number) {
  if (length >= 10) return { label: 'Strong enough', bar: 'w-full bg-emerald-500', text: 'text-emerald-600' };
  if (length >= 6) return { label: `${10 - length} more characters`, bar: 'w-2/3 bg-amber-500', text: 'text-amber-600' };
  return { label: `${10 - length} more characters`, bar: 'w-1/3 bg-rose-400', text: 'text-rose-600' };
}

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

  const s = strength(password.length);

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Turn supplier catalogs into Shopify-ready products."
      footer={
        <div className="space-y-5">
          <p className="text-center text-sm text-slate-500">
            Already registered?{' '}
            <Link className="font-semibold text-indigo-600 hover:text-indigo-500" href="/login">
              Log in
            </Link>
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
            {['No credit card required', 'Free plan', 'Secure & private'].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <AuthField
            id="name"
            label="Full name"
            icon={User}
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <AuthField
            id="workspace"
            label="Workspace"
            hint="(optional)"
            icon={Building2}
            autoComplete="organization"
            placeholder="My Store"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
        </div>

        <AuthField
          id="email"
          label="Work email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="jane@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <AuthField
            id="password"
            label="Password"
            hint="(min. 10 characters)"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={10}
          />
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex-1 h-1 rounded-full bg-slate-200 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${s.bar}`} />
              </div>
              <span className={`text-[11px] font-semibold ${s.text}`}>{s.label}</span>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="notification notification-error animate-fade-in">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button disabled={busy} type="submit" className="btn btn-primary w-full justify-center h-11 text-sm">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating workspace…
            </>
          ) : (
            <>
              Create workspace
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
