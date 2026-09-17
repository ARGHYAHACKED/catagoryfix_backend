'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function PlaceholderPage() {
  return (
    <DashboardShell>
      <h1 className="text-xl font-semibold">Coming after the import/export milestone</h1>
      <p className="mt-2 text-sm text-muted">Direct store connections are architected but not required for V1 CSV export.</p>
    </DashboardShell>
  );
}
