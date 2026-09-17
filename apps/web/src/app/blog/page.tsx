import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/blog-data';
import { BookOpen, Calendar, Clock, ArrowRight, User } from 'lucide-react';

export const metadata = buildMetadata({
  title: 'Ecommerce CSV & Shopify Blog | Formatting Guides & Tutorials',
  description:
    'In-depth guides on Shopify CSV imports, supplier feed cleanups, variant formatting, and catalog data automation for ecommerce merchants.',
  path: '/blog',
  keywords: [
    'shopify csv blog',
    'ecommerce catalog guides',
    'supplier product import tutorials',
    'shopify CSV errors guide',
  ],
});

export default function BlogIndexPage() {
  return (
    <MarketingShell>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ name: 'Blog', url: '/blog' }]} />

        <div className="text-center py-12 max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Knowledge Base & Tutorials
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Ecommerce Product Data & CSV Blog
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Practical guides to help you clean supplier feeds, fix Shopify import errors, and automate catalog operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto my-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden p-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold uppercase tracking-wider rounded-md">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.author}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}
