'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import Link from 'next/link';
import { Package, ArrowRight, FileSpreadsheet } from 'lucide-react';

export default function ProductsIndexPage() {
  return (
    <DashboardShell>
      <div className="page-header flex flex-col gap-1.5 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700 text-white shadow-md">
            <Package className="h-[18px] w-[18px]" />
          </div>
          Products
        </h1>
        <p className="text-sm text-slate-500 ml-12">
          Products are accessed through imports. Open an import to view and edit individual products.
        </p>
      </div>

      <div className="max-w-lg">
        <div className="card p-8 text-center animate-scale-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
            <Package className="h-8 w-8" />
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-2">Open a Catalog Import</h2>
          <p className="text-sm text-slate-500 mb-6">
            Products are organized under catalog imports. Navigate to an import to view, edit, and manage individual product records.
          </p>
          <Link
            href="/dashboard/imports"
            className="btn btn-primary"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Go to Imports
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
