'use client';

import { useEffect, useId, useRef } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * App-styled replacement for window.confirm(): a bottom sheet on phones,
 * a centred dialog on larger screens. Escape or a backdrop tap closes it.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Keep it',
  tone = 'danger',
  busy = false,
  error,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  busy?: boolean;
  /** Shown inside the dialog when the confirmed action failed. */
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const keepRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Focus the safe choice first, so Enter never destroys anything by accident.
    keepRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, busy, onClose]);

  if (!open) return null;

  const danger = tone === 'danger';
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={() => !busy && onClose()}
        className="absolute inset-0 bg-slate-950/55 animate-fade-in"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative w-full rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-slide-up dark:border-slate-800 dark:bg-slate-900 sm:max-w-md sm:rounded-2xl sm:animate-scale-in"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-700 sm:hidden" aria-hidden="true" />
        <div className="flex gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              danger ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold leading-snug">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={keepRef}
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition disabled:opacity-70 ${
              danger ? 'bg-rose-600 hover:bg-rose-500' : 'bg-blue-600 hover:bg-blue-500 dark:bg-blue-500'
            }`}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Turns raw API/HTTP errors into a sentence a user can act on. */
export function friendlyError(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : '';
  if (!message || /^Cannot (GET|POST|PUT|PATCH|DELETE)\b/.test(message) || /Request failed|Failed to fetch/i.test(message)) {
    return fallback;
  }
  return message;
}
