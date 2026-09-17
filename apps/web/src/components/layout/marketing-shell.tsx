'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, FileSpreadsheet, ShieldCheck, ChevronRight } from 'lucide-react';

interface MarketingShellProps {
  children: React.ReactNode;
}

export function MarketingShell({ children }: MarketingShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'Free Tools', href: '/tools' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white antialiased">
      {/* HEADER */}
      <header className="sticky top-0 z-50 h-[76px] bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo_catalogfix.png" alt="CatalogFix" className="h-9 w-auto object-contain max-h-[38px]" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-[#2563EB] font-semibold' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2.5 rounded-[8px] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Try CatalogFix</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#64748B] hover:text-[#0F172A]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#0F172A] hover:text-[#2563EB] py-1.5"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-[#0F172A] border border-[#E2E8F0] rounded-[8px]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#2563EB] rounded-[8px]"
              >
                Try CatalogFix
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] text-[#94A3B8] border-t border-slate-800 pt-16 pb-12 text-sm">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 pb-12 border-b border-slate-800">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <img src="/logo_catalogfix.png" alt="CatalogFix" className="h-9 w-auto object-contain max-h-[38px]" />
              </Link>
              <p className="text-[#94A3B8] text-xs leading-relaxed max-w-sm">
                Transform raw supplier spreadsheets and messy catalog files into store-ready Shopify product CSV feeds automatically with AI mapping, variant handling, and schema validation.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise-grade AES-256 Data Protection</span>
              </div>
            </div>

            {/* Money Solutions */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Core Solutions</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/shopify-csv-converter" className="hover:text-[#60A5FA] transition-colors">
                    Shopify CSV Converter
                  </Link>
                </li>
                <li>
                  <Link href="/supplier-csv-to-shopify" className="hover:text-[#60A5FA] transition-colors">
                    Supplier CSV to Shopify
                  </Link>
                </li>
                <li>
                  <Link href="/shopify-csv-validator" className="hover:text-[#60A5FA] transition-colors">
                    Shopify CSV Validator
                  </Link>
                </li>
                <li>
                  <Link href="/bulk-shopify-product-upload" className="hover:text-[#60A5FA] transition-colors">
                    Bulk Product Upload
                  </Link>
                </li>
                <li>
                  <Link href="/excel-to-shopify" className="hover:text-[#60A5FA] transition-colors">
                    Excel to Shopify
                  </Link>
                </li>
                <li>
                  <Link href="/shopify-variant-csv" className="hover:text-[#60A5FA] transition-colors">
                    Shopify Variant CSV
                  </Link>
                </li>
              </ul>
            </div>

            {/* Free Tools */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Free Tools</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/tools/shopify-csv-validator" className="hover:text-[#60A5FA] transition-colors">
                    CSV Validator Tool
                  </Link>
                </li>
                <li>
                  <Link href="/tools/duplicate-sku-checker" className="hover:text-[#60A5FA] transition-colors">
                    Duplicate SKU Checker
                  </Link>
                </li>
                <li>
                  <Link href="/tools/csv-header-checker" className="hover:text-[#60A5FA] transition-colors">
                    CSV Header Checker
                  </Link>
                </li>
                <li>
                  <Link href="/tools/shopify-handle-generator" className="hover:text-[#60A5FA] transition-colors">
                    Shopify Handle Generator
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-[#60A5FA] font-semibold text-indigo-400 transition-colors">
                    View All Free Tools →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Integrations & Resources */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/integrations/shopify" className="hover:text-[#60A5FA] transition-colors">
                    Shopify Integration
                  </Link>
                </li>
                <li>
                  <Link href="/integrations/woocommerce" className="hover:text-[#60A5FA] transition-colors">
                    WooCommerce (Upcoming)
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-[#60A5FA] transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-[#60A5FA] transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#60A5FA] transition-colors">
                    Ecommerce Guides & Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company & Legal */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/about" className="hover:text-[#60A5FA] transition-colors">
                    About CatalogFix
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-[#60A5FA] transition-colors">
                    Security & Trust
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#60A5FA] transition-colors">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#60A5FA] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#60A5FA] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
            <p>© {new Date().getFullYear()} CatalogFix Inc. All rights reserved.</p>
            <p className="text-slate-400">Production-grade SEO & Catalog Automation for Global Merchants.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
