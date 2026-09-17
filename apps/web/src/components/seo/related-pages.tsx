import Link from 'next/link';
import { ArrowRight, FileSpreadsheet, CheckCircle2, RefreshCw } from 'lucide-react';

export interface RelatedLink {
  title: string;
  description: string;
  url: string;
  category?: string;
}

interface RelatedPagesProps {
  title?: string;
  links: RelatedLink[];
}

export function RelatedPages({ title = 'Related Solutions & Tools', links }: RelatedPagesProps) {
  if (!links || links.length === 0) return null;

  return (
    <section className="my-12 pt-8 border-t border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {link.category && (
                <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 mb-2 block">
                  {link.category}
                </span>
              )}
              <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 flex items-center gap-2">
                <span>{link.title}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {link.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Explore Solution</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
