export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: 'Shopify' | 'CSV Guides' | 'Supplier Feeds' | 'Catalog Management';
  publishedDate: string;
  modifiedDate: string;
  readTime: string;
  author: string;
  content: string;
  relatedSolutions: { title: string; url: string; description: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-import-products-to-shopify-using-csv',
    title: 'How to Import Products to Shopify Using CSV: Step-by-Step Guide',
    description:
      'Learn how to prepare, format, validate, and bulk import product catalogs into Shopify using CSV files without import error rejections.',
    category: 'Shopify',
    publishedDate: '2026-09-01T08:00:00.000Z',
    modifiedDate: '2026-09-15T08:00:00.000Z',
    readTime: '6 min read',
    author: 'CatalogFix Data Team',
    content: `
Importing product catalogs into Shopify via CSV is the fastest way to populate or update an e-commerce store. However, a single missing column or malformed variant header will cause Shopify to reject the entire batch.

### Step 1: Prepare Your Product CSV
Before uploading to Shopify Admin, ensure your CSV uses UTF-8 encoding and includes the required headers:
- **Handle**: Unique URL-friendly slug (e.g., \`mens-leather-jacket\`)
- **Title**: Official product name shown to buyers
- **Body (HTML)**: Product description in clean HTML format
- **Vendor**: Manufacturer or brand name
- **Type**: Store category taxonomy
- **Variant SKU**: Unique stock keeping unit code
- **Variant Price**: Decimal numerical cost (e.g., \`49.99\`)

### Step 2: Format Multi-Option Product Variants
If your products come in different sizes or colors, every variant row must share the exact same **Handle**. Only the first row contains product title and description; subsequent variant rows specify unique Option values.

### Step 3: Upload to Shopify Admin
1. Log into your Shopify Admin dashboard.
2. Navigate to **Products** > **Import**.
3. Select your validated CSV file.
4. Click **Upload and preview**, then click **Import products**.

### Step 4: Avoid Common Import Failures
Use an automated pre-import validator like CatalogFix to check for duplicate SKUs, missing handles, and illegal quotation marks before uploading.
    `,
    relatedSolutions: [
      {
        title: 'Shopify CSV Converter',
        url: '/shopify-csv-converter',
        description: 'Convert supplier CSV spreadsheets into Shopify import format automatically.',
      },
      {
        title: 'Shopify CSV Validator',
        url: '/shopify-csv-validator',
        description: 'Check CSV files for import errors before uploading.',
      },
    ],
  },
  {
    slug: 'shopify-csv-format-explained',
    title: 'Shopify CSV Format Explained: Complete Field Specification',
    description:
      'A complete reference guide to official Shopify product CSV headers, variant option rules, price formatting, and image Src arrays.',
    category: 'CSV Guides',
    publishedDate: '2026-09-05T08:00:00.000Z',
    modifiedDate: '2026-09-15T08:00:00.000Z',
    readTime: '8 min read',
    author: 'CatalogFix Technical SEO',
    content: `
Understanding Shopify's CSV structure is essential for avoiding failed bulk product imports.

### Standard Column Headers
Shopify's CSV parser expects specific exact column headers:
1. **Handle**: Required. Must be lowercase letters, numbers, and hyphens.
2. **Title**: Product title.
3. **Body (HTML)**: Product description formatted in HTML.
4. **Vendor**: Manufacturer or vendor string.
5. **Type**: Product category.
6. **Tags**: Comma-separated list of product tags.
7. **Option1 Name & Value**: Primary variant attribute (e.g. \`Size\`, \`Large\`).
8. **Option2 Name & Value**: Secondary attribute (e.g. \`Color\`, \`Blue\`).
9. **Variant SKU**: Unique SKU string.
10. **Variant Price**: Retail price without currency symbols.
11. **Image Src**: Publicly accessible image URL starting with \`http://\` or \`https://\`.

### Crucial CSV Rules
- Do NOT add currency symbols (\$\) to price cells.
- Ensure all text cells containing commas are wrapped in double quotes.
- HTML quotes inside description cells must be escaped (\`""\`).
    `,
    relatedSolutions: [
      {
        title: 'Shopify Variant CSV Generator',
        url: '/shopify-variant-csv',
        description: 'Format complex multi-option variants for Shopify.',
      },
      {
        title: 'Free CSV Header Checker',
        url: '/tools/csv-header-checker',
        description: 'Verify your CSV headers against Shopify specifications.',
      },
    ],
  },
  {
    slug: 'how-to-fix-shopify-csv-import-errors',
    title: 'How to Fix Shopify CSV Import Errors (Top 10 Solutions)',
    description:
      'Troubleshoot common Shopify CSV import errors such as "Illegal quoting", "Line X: Missing Option1 Name", and duplicate SKU failures.',
    category: 'Shopify',
    publishedDate: '2026-09-10T08:00:00.000Z',
    modifiedDate: '2026-09-15T08:00:00.000Z',
    readTime: '5 min read',
    author: 'CatalogFix Engineering',
    content: `
When Shopify displays an import error banner, it often rejects the entire spreadsheet. Here are fixes for the top 10 most frequent import failures.

### Error 1: "Illegal quoting on line X"
**Cause**: Unescaped quotation marks in product description HTML or unclosed quote strings.
**Fix**: Re-encode description HTML using standard double-quote escaping or convert your file with CatalogFix.

### Error 2: "Missing Option1 Name"
**Cause**: Variant rows specified an \`Option1 Value\` without defining the parent \`Option1 Name\` in header rows.
**Fix**: Ensure \`Option1 Name\` (e.g. "Size") is set on the first product row.

### Error 3: "Duplicate SKU found"
**Cause**: Two distinct products or variants share the exact same SKU code.
**Fix**: Run our free Duplicate SKU Checker tool to identify and fix repeating SKUs.
    `,
    relatedSolutions: [
      {
        title: 'Shopify CSV Validator',
        url: '/shopify-csv-validator',
        description: 'Run automated checks on your file before uploading to Shopify.',
      },
      {
        title: 'Free Duplicate SKU Checker',
        url: '/tools/duplicate-sku-checker',
        description: 'Find duplicate barcodes and SKUs across your catalog.',
      },
    ],
  },
  {
    slug: 'how-to-bulk-upload-products-to-shopify',
    title: 'How to Bulk Upload Products to Shopify (10,000+ SKUs)',
    description:
      'Guide to uploading massive product catalogs to Shopify efficiently. Split large CSV files, handle image hosting, and manage inventory feeds.',
    category: 'Catalog Management',
    publishedDate: '2026-09-12T08:00:00.000Z',
    modifiedDate: '2026-09-15T08:00:00.000Z',
    readTime: '7 min read',
    author: 'CatalogFix Operations',
    content: `
Managing large product catalogs (10,000 to 100,000+ SKUs) requires specialized workflow strategies to avoid Shopify Admin file size limits and server timeouts.

### 1. File Chunking Strategy
Shopify limits individual CSV file uploads to 15MB. For large catalogs, split your processed product feed into chunked files containing 5,000 SKUs each.

### 2. Image URL Hosting
Ensure product image URLs (\`Image Src\`) point to reliable CDN storage with direct image file extensions (.jpg, .png, .webp).
    `,
    relatedSolutions: [
      {
        title: 'Bulk Shopify Product Upload',
        url: '/bulk-shopify-product-upload',
        description: 'Batch upload large catalog feeds without timeouts.',
      },
    ],
  },
  {
    slug: 'how-to-convert-supplier-csv-files-for-shopify',
    title: 'How to Convert Supplier CSV Files for Shopify',
    description:
      'Step-by-step tutorial on taking raw manufacturer dropship feeds and transforming them into Shopify-ready product CSVs.',
    category: 'Supplier Feeds',
    publishedDate: '2026-09-14T08:00:00.000Z',
    modifiedDate: '2026-09-15T08:00:00.000Z',
    readTime: '6 min read',
    author: 'CatalogFix Data Team',
    content: `
Supplier CSV feeds are notoriously messy. They use custom internal column names like \`Item_Num\`, \`Wholesale_Price\`, and \`Desc_Short\`.

### 1. Standardize Column Headers
Map supplier fields to Shopify standard headers:
- \`Item_Num\` -> \`Variant SKU\`
- \`Wholesale_Price\` -> Apply markup formula -> \`Variant Price\`
- \`Product_Name\` -> \`Title\` & generate \`Handle\`

### 2. Automated Feed Processing
Use CatalogFix to save mapping presets for each supplier so weekly inventory updates take seconds instead of hours.
    `,
    relatedSolutions: [
      {
        title: 'Supplier CSV to Shopify',
        url: '/supplier-csv-to-shopify',
        description: 'Automate wholesale supplier catalog cleanup.',
      },
      {
        title: 'Shopify CSV Converter',
        url: '/shopify-csv-converter',
        description: 'Convert supplier CSVs into Shopify format.',
      },
    ],
  },
];
