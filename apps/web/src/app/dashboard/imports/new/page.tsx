'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrgId } from '@/hooks/use-org-id';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  FileText,
  X,
  FilePlus2,
  Cpu,
  ClipboardCheck,
  PackageCheck,
  CloudUpload,
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Upload File', icon: CloudUpload },
  { id: 2, name: 'Map Columns', icon: ClipboardCheck },
  { id: 3, name: 'Process', icon: Cpu },
  { id: 4, name: 'Audit & Review', icon: FileText },
  { id: 5, name: 'Export CSV', icon: PackageCheck },
];

const UPLOAD_STAGES = [
  { pct: 20, label: 'Creating import record…' },
  { pct: 50, label: 'Generating secure upload URL…' },
  { pct: 80, label: 'Uploading file to storage…' },
  { pct: 95, label: 'Confirming upload & queuing parse…' },
  { pct: 100, label: 'Done! Redirecting…' },
];

export default function NewImportPage() {
  const organizationId = useOrgId();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)');
      }
    }
  };

  const setProgress = (pct: number) => {
    const stage = UPLOAD_STAGES.find((s) => s.pct === pct);
    setUploadProgress(pct);
    if (stage) setStageLabel(stage.label);
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    setProgress(20);

    try {
      const created = await api<{ id: string }>('/imports', {
        method: 'POST',
        organizationId,
        body: JSON.stringify({ name: file.name, targetPlatform: 'SHOPIFY' }),
      });
      setProgress(50);

      const presign = await api<{ uploadUrl: string; storageKey: string }>('/uploads/presign', {
        method: 'POST',
        organizationId,
        body: JSON.stringify({
          importId: created.id,
          fileName: file.name,
          mimeType: file.type || 'text/csv',
          fileSize: file.size,
          type: 'CATALOG',
        }),
      });
      setProgress(80);

      const put = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'text/csv' },
        body: file,
      });
      if (!put.ok) throw new Error('Direct upload to storage failed.');
      setProgress(95);

      await api(`/imports/${created.id}/files/confirm`, {
        method: 'POST',
        organizationId,
        body: JSON.stringify({
          storageKey: presign.storageKey,
          originalName: file.name,
          mimeType: file.type || 'text/csv',
          fileSize: file.size,
          type: 'CATALOG',
        }),
      });
      setProgress(100);

      setTimeout(() => router.push(`/dashboard/imports/${created.id}`), 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setBusy(false);
      setUploadProgress(0);
      setStageLabel('');
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="page-header flex flex-col gap-1.5 mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
          <span>Imports</span>
          <span>›</span>
          <span className="text-slate-600">New Import</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
            <FilePlus2 className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          </div>
          New Catalog Import
        </h1>
        <p className="text-sm text-slate-500 ml-12">
          Upload your raw supplier CSV or Excel file to begin column mapping and Shopify export.
        </p>
      </div>

      {/* Wizard Steps */}
      <div className="mb-8 animate-fade-in-up delay-100">
        <div className="card p-4">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCurrent = step.id === 1;
              const isPast = false;
              return (
                <li
                  key={step.id}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-100'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? '✓' : <Icon className="h-3 w-3" />}
                  </div>
                  <span className="truncate">{step.name}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={onSubmit} className="max-w-2xl animate-fade-in-up delay-200">

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !busy && fileInputRef.current?.click()}
          className={`upload-zone p-12 text-center flex flex-col items-center justify-center mb-5 ${
            dragActive ? 'drag-active' : file ? 'file-selected' : ''
          } ${busy ? 'pointer-events-none opacity-80' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setError('');
              }
            }}
          />

          {!file ? (
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="relative mb-5">
                <div className="flex h-18 w-18 h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 shadow-sm">
                  <UploadCloud className={`h-9 w-9 text-indigo-500 ${dragActive ? 'animate-bounce-subtle' : 'animate-float'}`} />
                </div>
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-2xl border-2 border-indigo-200 opacity-30 scale-110" />
                <div className="absolute inset-0 rounded-2xl border border-indigo-100 opacity-20 scale-125" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                {dragActive ? 'Drop it right here!' : 'Drop your CSV or Excel file here'}
              </h3>
              <p className="text-sm text-slate-400 mb-6 max-w-xs">
                Supports <span className="font-semibold text-slate-600">.csv, .xlsx, .xls</span> · Up to <span className="font-semibold text-slate-600">50 MB</span> · Auto-detects columns
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Browse Files
                </button>
                <span className="text-xs text-slate-300">or drag &amp; drop</span>
              </div>

              {/* Supported formats */}
              <div className="flex items-center gap-2 mt-6">
                {['.CSV', '.XLSX', '.XLS'].map((ext) => (
                  <span key={ext} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 tracking-wide">
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm animate-scale-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mb-3 shadow-sm">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <div className="text-sm font-bold text-slate-900 truncate max-w-xs mb-0.5">{file.name}</div>
              <div className="text-xs text-slate-400 mb-1">{formatFileSize(file.size)}</div>
              <div className="badge badge-success mb-4">
                <CheckCircle2 className="h-3 w-3" />
                Ready to upload
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {busy && (
          <div className="card p-5 mb-5 animate-scale-in border-indigo-100">
            {/* Stage header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-indigo-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                </div>
                <span>{stageLabel || 'Uploading…'}</span>
              </div>
              <span className="text-sm font-bold text-indigo-600 tabular-nums">{uploadProgress}%</span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            {/* Stage dots */}
            <div className="flex items-center justify-between mt-3">
              {UPLOAD_STAGES.map((stage) => (
                <div
                  key={stage.pct}
                  className={`flex flex-col items-center gap-1 ${uploadProgress >= stage.pct ? 'opacity-100' : 'opacity-30'}`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full transition-colors ${uploadProgress >= stage.pct ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-slate-400 text-center">
              Please don't close this tab while the file is being processed.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="notification notification-error mb-5 animate-fade-in">
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-rose-800 text-sm mb-0.5">Upload Failed</div>
              <div className="text-xs text-rose-700">{error}</div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {file ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {file.name} selected
              </span>
            ) : (
              'No file selected'
            )}
          </div>
          <button
            type="submit"
            disabled={!file || busy}
            className="btn btn-primary"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading…</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                <span>Upload &amp; Continue</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info box */}
      <div className="max-w-2xl mt-8 animate-fade-in-up delay-300">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-5">
          <div className="text-xs font-bold text-indigo-900 mb-3 uppercase tracking-wider">What happens next?</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: '1', title: 'File Parsed', desc: 'We auto-detect delimiters, encoding, and header rows.' },
              { step: '2', title: 'Column Mapping', desc: 'Match supplier fields to standard Shopify product attributes.' },
              { step: '3', title: 'Validation & Export', desc: 'Review issues and export a clean Shopify CSV.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <div className="text-xs font-semibold text-indigo-900">{item.title}</div>
                  <div className="text-[11px] text-indigo-600 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
