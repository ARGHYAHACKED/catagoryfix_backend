import {
  generateCanonicalUrl,
  buildMetadata,
  buildOrganizationSchema,
  buildSoftwareAppSchema,
  SITE_URL,
} from '../seo';
import sitemap from '../../app/sitemap';
import robots from '../../app/robots';

export function runSeoAssertions() {
  // Test canonical URL generation
  const rootCanonical = generateCanonicalUrl('/');
  if (rootCanonical !== SITE_URL) {
    throw new Error(`Canonical root failed: expected ${SITE_URL}, got ${rootCanonical}`);
  }

  const pathCanonical = generateCanonicalUrl('/shopify-csv-converter/');
  if (pathCanonical !== `${SITE_URL}/shopify-csv-converter`) {
    throw new Error(`Canonical path failed: got ${pathCanonical}`);
  }

  // Test metadata builder
  const meta = buildMetadata({
    title: 'Test Title',
    description: 'Test Description',
    path: '/test-path',
  });

  if ((meta.title as any)?.absolute !== 'Test Title | CatalogFix') {
    throw new Error(`Title assertion failed`);
  }
  if (meta.alternates?.canonical !== `${SITE_URL}/test-path`) {
    throw new Error(`Canonical assertion failed`);
  }

  // Test noIndex metadata
  const privateMeta = buildMetadata({
    title: 'Private',
    description: 'Private',
    path: '/dashboard',
    noIndex: true,
  });

  if ((privateMeta.robots as any)?.index !== false) {
    throw new Error(`NoIndex assertion failed`);
  }

  // Test schemas
  const org = buildOrganizationSchema();
  if (org['@type'] !== 'Organization' || org.url !== SITE_URL) {
    throw new Error(`Organization schema assertion failed`);
  }

  const app = buildSoftwareAppSchema();
  if (app['@type'] !== 'SoftwareApplication' || 'aggregateRating' in app) {
    throw new Error(`SoftwareApplication schema assertion failed`);
  }

  // Test sitemap routes
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  if (!urls.includes(`${SITE_URL}/shopify-csv-converter`)) {
    throw new Error(`Sitemap missing /shopify-csv-converter`);
  }
  if (!urls.includes(`${SITE_URL}/tools/shopify-csv-validator`)) {
    throw new Error(`Sitemap missing free tool`);
  }
  if (urls.includes(`${SITE_URL}/login`) || urls.includes(`${SITE_URL}/signup`)) {
    throw new Error(`Sitemap incorrectly contains private auth page`);
  }

  // Test robots.txt
  const rob = robots();
  const rules = Array.isArray(rob.rules) ? rob.rules[0] : rob.rules;
  if (!rules || !Array.isArray(rules.disallow)) {
    throw new Error(`Robots rules format invalid`);
  }

  return true;
}
