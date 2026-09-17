import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Plan, prisma } from '@catalogfix/database';
import { AuthGuard } from '../common/auth.guard';
import { OrganizationGuard } from '../common/organization.guard';
import { currentPeriod } from '../common/crypto';
import { EntitlementService } from '../common/entitlements';
import type { Request } from 'express';

@Controller('dashboard')
@UseGuards(AuthGuard, OrganizationGuard)
export class DashboardController {
  private entitlements = new EntitlementService();

  @Get('summary')
  async summary(@Req() req: Request & { organizationId?: string }) {
    const orgId = req.organizationId!;
    const period = currentPeriod();
    const [usage, subscription, imports, exports, errorCount, readyCount] = await Promise.all([
      prisma.usageRecord.upsert({
        where: { organizationId_period: { organizationId: orgId, period } },
        update: {},
        create: { organizationId: orgId, period },
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
    ]);
    const plan = subscription?.plan ?? Plan.FREE;
    return {
      productsProcessed: usage.productsProcessed,
      aiGenerations: usage.aiGenerations,
      plan,
      monthlyLimit: this.entitlements.getMonthlyProductLimit(plan),
      recentImports: imports,
      recentExports: exports,
      errorsRequiringAttention: errorCount,
      productsReadyToExport: readyCount,
    };
  }
}
