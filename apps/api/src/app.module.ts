import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UploadsModule } from './uploads/uploads.module';
import { ImportsModule } from './imports/imports.module';
import { ProductsModule } from './products/products.module';
import { ExportsModule } from './exports/exports.module';
import { HealthModule } from './health/health.module';
import { BillingModule } from './billing/billing.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { RequestIdMiddleware } from './common/request-id.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 120 }] }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    UploadsModule,
    ImportsModule,
    ProductsModule,
    ExportsModule,
    HealthModule,
    BillingModule,
    WebhooksModule,
    DashboardModule,
    AdminModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
