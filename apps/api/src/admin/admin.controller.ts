import { Controller, Get, Patch, Param, Body, Query, UseGuards, Inject } from '@nestjs/common';
import { AdminGuard } from '../common/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(@Inject(AdminService) private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getSystemStats();
  }

  @Get('users')
  async getUsers(
    @Query('search') search?: string,
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.adminService.getAllUsers(search, parseInt(limit, 10), parseInt(offset, 10));
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') userId: string,
    @Body('systemRole') systemRole: 'USER' | 'ADMIN',
  ) {
    return this.adminService.updateUserRole(userId, systemRole);
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body('status') status: 'ACTIVE' | 'SUSPENDED',
  ) {
    return this.adminService.updateUserStatus(userId, status);
  }

  @Get('organizations')
  async getOrganizations(
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.adminService.getAllOrganizations(parseInt(limit, 10), parseInt(offset, 10));
  }

  @Get('imports')
  async getImports(
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.adminService.getAllImports(parseInt(limit, 10), parseInt(offset, 10));
  }

  @Get('exports')
  async getExports(
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.adminService.getAllExports(parseInt(limit, 10), parseInt(offset, 10));
  }

  @Get('audit-logs')
  async getAuditLogs(
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.adminService.getAuditLogs(parseInt(limit, 10), parseInt(offset, 10));
  }

  @Get('subscriptions')
  async getSubscriptions(
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.adminService.getAllSubscriptions(parseInt(limit, 10), parseInt(offset, 10));
  }

  @Patch('subscriptions/:id')
  async updateSubscription(
    @Param('id') subscriptionId: string,
    @Body('plan') plan: 'FREE' | 'STARTER' | 'BUSINESS' | 'PRO',
    @Body('status') status?: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIALING' | 'EXPIRED',
  ) {
    return this.adminService.updateSubscription(subscriptionId, plan, status);
  }
}
