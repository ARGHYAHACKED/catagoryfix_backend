import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://catalogfix.io';
export const SITE_NAME = 'CatalogFix';
export const DEFAULT_TITLE = 'CatalogFix | AI-Powered CSV & Supplier Catalog Sorter';
export const DEFAULT_DESCRIPTION =
  'Transform messy supplier spreadsheets and raw CSV files into shop-ready product feeds instantly with AI column mapping, automated variant extraction, and smart data validation.';

export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedPath = cleanPath === '/' ? '' : cleanPath.replace(/\/+$/, '');
  return `${SITE_URL}${normalizedPath}`;
}

export interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogImage = '/og-image.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: BuildMetadataOptions): Metadata {
  const canonicalUrl = generateCanonicalUrl(path);
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  const defaultKeywords = [
    'Shopify CSV converter',
    'Supplier product CSV',
    'E-commerce catalog cleaner',
    'Bulk product upload Shopify',
    'Product data validation',
    'Excel to Shopify',
    'Shopify variant CSV format',
    'Product feed cleaner',
    'CSV product cleaner',
  ];

  const mergedKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));

  return {
    title: {
      absolute: `${title} | ${SITE_NAME}`,
    },
    description,
    keywords: mergedKeywords,
    authors: authors ? authors.map((name) => ({ name })) : [{ name: `${SITE_NAME} Team` }],
    creator: `${SITE_NAME} Inc.`,
    publisher: `${SITE_NAME} Inc.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} preview card`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      creator: '@catalogfix',
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: `${SITE_NAME} Inc.`,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      'https://twitter.com/catalogfix',
      'https://github.com/catalogfix',
      'https://linkedin.com/company/catalogfix',
    ],
  };
}

export function buildSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: 'CatalogFix AI Supplier Catalog Sorter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
    })),
  };
}

export function buildArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  authorName = 'CatalogFix Team',
  image = '/og-image.png',
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  image?: string;
}) {
  const url = `${SITE_URL}/blog/${slug}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: `${SITE_NAME} Inc.`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    image: imageUrl,
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
