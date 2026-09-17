import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview';

  if (!isProduction) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/account/',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/admin/',
          '/api/',
          '/internal/',
          '/*?*', // Prevent search parameter crawling duplicates
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
