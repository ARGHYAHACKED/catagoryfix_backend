import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd } from './json-ld';
import { buildBreadcrumbSchema } from '@/lib/seo';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullItems = [{ name: 'Home', url: '/' }, ...items];
  const schemaData = buildBreadcrumbSchema(fullItems);

  return (
    <>
      <JsonLd data={schemaData} />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={item.url} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                {isLast ? (
                  <span className="text-indigo-600 font-semibold truncate max-w-[200px] sm:max-w-none" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-indigo-600 transition-colors flex items-center gap-1"
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
