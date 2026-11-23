import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ExportStatus, ImportStatus, Plan, prisma } from '@catalogfix/database';
import { AuthGuard } from '../common/auth.guard';
import { OrganizationGuard } from '../common/organization.guard';
import { currentPeriod } from '../common/crypto';
import { EntitlementService } from '../common/entitlements';
import type { Request } from 'express';

/** Import statuses that mean a worker is (or is about to be) processing the file. */
const ACTIVE_IMPORT_STATUSES: ImportStatus[] = [
  ImportStatus.UPLOADED,
  ImportStatus.QUEUED,
  ImportStatus.PARSING,
  ImportStatus.PROCESSING,
  ImportStatus.VALIDATING,
];

const CHART_DAYS = 14;

function previousPeriod(): string {
  const now = new Date();
  const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return `${prev.getUTCFullYear()}-${String(prev.getUTCMonth() + 1).padStart(2, '0')}`;
}

function startOfMonthUtc(offsetMonths = 0): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offsetMonths, 1));
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Controller('dashboard')
@UseGuards(AuthGuard, OrganizationGuard)
export class DashboardController {
  private entitlements = new EntitlementService();

  @Get('summary')
  async summary(@Req() req: Request & { organizationId?: string }) {
    const orgId = req.organizationId!;
    const period = currentPeriod();
    const thisMonth = startOfMonthUtc(0);
    const lastMonth = startOfMonthUtc(-1);
    const chartStart = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() - (CHART_DAYS - 1)));

    const [
      usage,
      previousUsage,
      subscription,
      imports,
      exports,
      errorCount,
      readyCount,
      exportsThisMonth,
      exportsLastMonth,
      issueGroups,
      chartImports,
      activeImport,
      mappingRequired,
    ] = await Promise.all([
      prisma.usageRecord.upsert({
        where: { organizationId_period: { organizationId: orgId, period } },
        update: {},
        create: { organizationId: orgId, period },
      }),
      prisma.usageRecord.findUnique({
        where: { organizationId_period: { organizationId: orgId, period: previousPeriod() } },
      }),
      prisma.subscription.findUnique({ where: { organizationId: orgId } }),
      prisma.importJob.findMany({
        where: { organizationId: orgId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.exportJob.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.validationIssue.count({
        where: { import: { organizationId: orgId }, severity: 'ERROR', resolved: false },
      }),
      prisma.product.count({
        where: { import: { organizationId: orgId }, status: 'READY' },
      }),
      prisma.exportJob.count({
        where: { organizationId: orgId, status: ExportStatus.COMPLETED, createdAt: { gte: thisMonth } },
      }),
      prisma.exportJob.count({
        where: { organizationId: orgId, status: ExportStatus.COMPLETED, createdAt: { gte: lastMonth, lt: thisMonth } },
      }),
      prisma.validationIssue.groupBy({
        by: ['code'],
        where: { import: { organizationId: orgId }, createdAt: { gte: thisMonth } },
        _count: { _all: true },
        orderBy: { _count: { code: 'desc' } },
        take: 5,
      }),
      prisma.importJob.findMany({
        where: { organizationId: orgId, deletedAt: null, createdAt: { gte: chartStart } },
        select: { createdAt: true, totalRows: true },
      }),
      prisma.importJob.findFirst({
        where: { organizationId: orgId, deletedAt: null, status: { in: ACTIVE_IMPORT_STATUSES } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          targetPlatform: true,
          totalRows: true,
          processedRows: true,
          progressPercentage: true,
          currentStage: true,
        },
      }),
      prisma.importJob.count({
        where: { organizationId: orgId, deletedAt: null, status: ImportStatus.MAPPING_REQUIRED },
      }),
    ]);

    // Rows imported per day, oldest first, with zero-filled gaps.
    const rowsByDay = new Map<string, number>();
    for (let i = 0; i < CHART_DAYS; i++) {
      rowsByDay.set(dayKey(new Date(chartStart.getTime() + i * 86_400_000)), 0);
    }
    for (const job of chartImports) {
      const key = dayKey(job.createdAt);
      if (rowsByDay.has(key)) rowsByDay.set(key, (rowsByDay.get(key) ?? 0) + job.totalRows);
    }

    const plan = subscription?.plan ?? Plan.FREE;
    return {
      // Existing fields (kept for compatibility)
      productsProcessed: usage.productsProcessed,
      aiGenerations: usage.aiGenerations,
      plan,
      monthlyLimit: this.entitlements.getMonthlyProductLimit(plan),
      recentImports: imports,
      recentExports: exports,
      errorsRequiringAttention: errorCount,
      productsReadyToExport: readyCount,
      // Real comparisons and breakdowns for the dashboard
      productsProcessedLastMonth: previousUsage?.productsProcessed ?? null,
      exportsCompletedThisMonth: exportsThisMonth,
      exportsCompletedLastMonth: exportsLastMonth,
      importsNeedingMapping: mappingRequired,
      issuesByCode: issueGroups.map((group) => ({ code: group.code, count: group._count._all })),
      rowsByDay: Array.from(rowsByDay, ([date, rows]) => ({ date, rows })),
      activeImport,
    };
  }
}
