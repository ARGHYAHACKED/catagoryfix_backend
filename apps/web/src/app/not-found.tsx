import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FileQuestion, ArrowRight, Home, Wrench, BookOpen, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <MarketingShell>
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-slate-50">
        <div className="max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">404 Error</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
              We couldn't find the catalog page or resource you were looking for. It may have been moved or updated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
            <Link
              href="/"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Homepage</h3>
                <p className="text-[11px] text-slate-500">Return to main catalog cleaner</p>
              </div>
            </Link>

            <Link
              href="/tools"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Free Tools</h3>
                <p className="text-[11px] text-slate-500">Check CSVs & SKU formats free</p>
              </div>
            </Link>

            <Link
              href="/blog"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Guides & Blog</h3>
                <p className="text-[11px] text-slate-500">Learn Shopify import fixes</p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Support</h3>
                <p className="text-[11px] text-slate-500">Get help with catalog files</p>
              </div>
            </Link>
          </div>

          <div className="pt-4">
            <Link
              href="/shopify-csv-converter"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>Looking for Shopify CSV Converter?</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
