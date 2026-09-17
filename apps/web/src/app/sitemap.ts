import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-09-15T00:00:00.000Z');

  const publicRoutes = [
    // Core Navigation & Company
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/features', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/security', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/resources', priority: 0.7, changeFrequency: 'weekly' as const },
    
    // Integrations
    { path: '/integrations', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/integrations/shopify', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/integrations/woocommerce', priority: 0.8, changeFrequency: 'monthly' as const },

    // Priority Group 1 High-Intent Money Landing Pages
    { path: '/shopify-csv-converter', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/supplier-csv-to-shopify', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/shopify-csv-validator', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/bulk-shopify-product-upload', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/excel-to-shopify', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/shopify-product-import', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/shopify-variant-csv', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/product-catalog-cleaner', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/product-feed-cleaner', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/csv-product-cleaner', priority: 0.85, changeFrequency: 'weekly' as const },

    // Free SEO Tools Strategy
    { path: '/tools', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/tools/shopify-csv-validator', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/duplicate-sku-checker', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/csv-header-checker', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/shopify-handle-generator', priority: 0.85, changeFrequency: 'weekly' as const },

    // Blog Architecture & Articles
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/blog/how-to-import-products-to-shopify-using-csv', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog/shopify-csv-format-explained', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog/how-to-fix-shopify-csv-import-errors', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog/how-to-bulk-upload-products-to-shopify', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/blog/how-to-convert-supplier-csv-files-for-shopify', priority: 0.75, changeFrequency: 'monthly' as const },

    // Legal
    { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
  ];

  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
