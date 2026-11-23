'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface RecentImport {
  id: string;
  name: string;
  status: string;
  sourcePlatform?: string;
  targetPlatform?: string;
  totalRows?: number;
  createdAt?: string;
}

export interface ActiveImport {
  id: string;
  name: string;
  status: string;
  targetPlatform: string;
  totalRows: number;
  processedRows: number;
  progressPercentage: number;
  currentStage: string | null;
}

export interface DashboardSummary {
  productsProcessed: number;
  aiGenerations: number;
  plan: string;
  monthlyLimit: number;
  recentImports: RecentImport[];
  recentExports: Array<{ id: string; status: string; platform: string; createdAt?: string }>;
  errorsRequiringAttention: number;
  productsReadyToExport: number;
  // Added fields; optional so an older API build still renders.
  productsProcessedLastMonth?: number | null;
  exportsCompletedThisMonth?: number;
  exportsCompletedLastMonth?: number;
  importsNeedingMapping?: number;
  issuesByCode?: Array<{ code: string; count: number }>;
  rowsByDay?: Array<{ date: string; rows: number }>;
  activeImport?: ActiveImport | null;
}

/** Plan limits at or above this are placeholders for "unlimited" in the API. */
export const UNLIMITED = 999_999;

export function useDashboardSummary(organizationId: string) {
  return useQuery({
    queryKey: ['dashboard', organizationId],
    queryFn: () => api<DashboardSummary>('/dashboard/summary', { organizationId }),
    enabled: Boolean(organizationId),
    // Poll while an import is running so the live progress card moves.
    refetchInterval: (query) => (query.state.data?.activeImport ? 3000 : false),
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['auth-me'],
    queryFn: () => api<{ user: { name?: string | null; email: string; systemRole: string } }>('/auth/me'),
    retry: false,
    staleTime: 5 * 60_000,
  });
}

/** "Jane Doe" → "JD"; falls back to the email's first letter. */
export function initials(name?: string | null, email?: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (email?.[0] ?? '?').toUpperCase();
}

/** Human labels for @catalogfix/validation issue codes (unknown codes are prettified). */
export function issueLabel(code: string): string {
  const known: Record<string, string> = {
    PRODUCT_MISSING_TITLE: 'Missing titles',
    PRODUCT_MISSING_SKU: 'Missing SKUs',
    DUPLICATE_SKU: 'Duplicate SKUs',
    INVALID_PRICE: 'Invalid prices',
    NEGATIVE_PRICE: 'Negative prices',
    INVALID_COMPARE_AT_PRICE: 'Bad compare-at prices',
    INVALID_INVENTORY: 'Invalid stock values',
    INVALID_BARCODE: 'Invalid barcodes',
    DUPLICATE_BARCODE: 'Duplicate barcodes',
    IMAGE_NOT_FOUND: 'Missing images',
    INVALID_IMAGE_URL: 'Broken image URLs',
    EMPTY_DESCRIPTION: 'Empty descriptions',
    DUPLICATE_HANDLE: 'Duplicate handles',
    UNSUPPORTED_HTML: 'Unsupported HTML',
    INVALID_WEIGHT: 'Invalid weights',
  };
  if (known[code]) return known[code];
  const text = code.replace(/^(VALIDATION|SHOPIFY|PRODUCT)_/, '').toLowerCase().replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function timeAgo(iso?: string): string {
  if (!iso) return '';
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} h ago`;
  if (seconds < 172_800) return 'Yesterday';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
