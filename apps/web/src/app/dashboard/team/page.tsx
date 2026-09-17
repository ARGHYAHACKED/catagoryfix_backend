'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function TeamPage() {
  return (
    <DashboardShell>
      <h1 className="text-xl font-semibold">Team</h1>
      <p className="mt-2 text-sm text-muted">Owner, Admin, and Member roles exist in the API. Invitations ship after the catalog workflow.</p>
    </DashboardShell>
  );
}
