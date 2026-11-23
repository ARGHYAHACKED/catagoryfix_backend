'use client';

import Link from 'next/link';
import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Sparkles, CheckCircle2, Eye, EyeOff, type LucideIcon } from 'lucide-react';

const FEATURES = [
  'Auto-detect CSV columns & encoding',
  'Multi-variant product grouping',
  'Shopify-compliant CSV export',
  'AI-powered content enhancement',
];

/** Two-column auth layout: brand panel on large screens, form on the right. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen flex bg-slate-50 antialiased">
      {/* Brand panel */}
      <aside className="hidden lg:flex lg:w-[460px] xl:w-[540px] shrink-0 flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 xl:p-12 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3 mb-16">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">CatalogFix</span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-4">
            Turn messy supplier catalogs into Shopify-ready products.
          </h2>
          <p className="text-indigo-100/80 text-sm leading-relaxed mb-10 max-w-sm">
            Upload any CSV or Excel file, map your columns, fix errors, and export a clean Shopify catalog in minutes.
          </p>

          <ul className="space-y-3.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-200/80">© {new Date().getFullYear()} CatalogFix. Built for Shopify merchants.</p>
      </aside>

      {/* Form column */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="h-[18px] w-[18px]" />
            </span>
            <span className="text-lg font-bold text-slate-900">CatalogFix</span>
          </Link>

          <header className="mb-8">
            <h1 className="text-[28px] leading-tight font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          </header>

          {children}

          {footer && <div className="mt-8">{footer}</div>}
        </div>
      </section>
    </main>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
};

/** Labelled input with a leading icon. Password fields get a show/hide toggle. */
export function AuthField({ id, label, hint, icon: Icon, type = 'text', ...props }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-1.5 mb-1.5 text-[13px] font-semibold text-slate-700">
        {label}
        {hint && <span className="text-[11px] font-normal text-slate-400">{hint}</span>}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          className={`input h-11 pl-10 text-sm bg-white ${isPassword ? 'pr-11' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
