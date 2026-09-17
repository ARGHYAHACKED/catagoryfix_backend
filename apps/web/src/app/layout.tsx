import type { Viewport } from 'next';
import './globals.css';
import { Providers } from '@/providers/providers';
import { buildMetadata, buildOrganizationSchema, buildSoftwareAppSchema, SITE_URL } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = buildMetadata({
  title: 'CatalogFix | AI-Powered CSV & Supplier Catalog Sorter',
  description:
    'Transform messy supplier spreadsheets and raw CSV files into shop-ready product feeds instantly with AI column mapping, automated variant extraction, and smart price rounding.',
  path: '/',
  keywords: [
    'CSV sorter',
    'Supplier catalog cleaner',
    'Shopify CSV importer',
    'Product catalog automation',
    'AI column mapping',
    'E-commerce data pipeline',
    'Variant price calculator',
    'CSV to Shopify',
    'WooCommerce CSV sorter',
  ],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [buildOrganizationSchema(), buildSoftwareAppSchema()],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd data={jsonLdData} />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

