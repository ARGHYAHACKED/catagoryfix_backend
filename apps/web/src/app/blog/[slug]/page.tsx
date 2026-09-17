import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { RelatedPages } from '@/components/seo/related-pages';
import { JsonLd } from '@/components/seo/json-ld';
import { buildMetadata, buildArticleSchema } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Calendar, Clock, User, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedDate,
    modifiedTime: post.modifiedDate,
    authors: [post.author],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.description,
    slug: post.slug,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    authorName: post.author,
  });

  return (
    <MarketingShell>
      <JsonLd data={articleSchema} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs
          items={[
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
        />

        <article className="max-w-3xl mx-auto py-8">
          {/* Header */}
          <header className="space-y-4 pb-8 border-b border-slate-200">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {post.description}
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(post.publishedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Article Body */}
          <div className="py-8 prose prose-slate max-w-none text-slate-800 space-y-6 text-sm sm:text-base leading-relaxed">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-slate-900 pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={idx} className="space-y-2 list-disc list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace(/^[0-9]+\.\s+|^-\s+/, '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* In-Article Conversion CTA */}
          <div className="my-12 p-8 bg-indigo-900 text-white rounded-2xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">Catalog Automation Solution</span>
            <h3 className="text-2xl font-bold">Clean & Convert Your Supplier Catalog Files Automatically</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don't spend hours fixing CSV import errors manually. Upload any supplier spreadsheet and output a 100% compliant Shopify CSV file in seconds.
            </p>
            <div>
              <Link
                href="/shopify-csv-converter"
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <span>Try Shopify CSV Converter Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Related Solutions */}
          <RelatedPages links={post.relatedSolutions} />
        </article>
      </div>
    </MarketingShell>
  );
}
