import { Module } from '@nestjs/common';
import { BillingController, UsageController } from './billing.controller';

@Module({ controllers: [BillingController, UsageController] })
export class BillingModule {}
