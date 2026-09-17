import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { loadConfig } from '@catalogfix/config';
import { prisma } from '@catalogfix/database';
import { AuthGuard } from '../common/auth.guard';
import { OrganizationGuard } from '../common/organization.guard';
import { currentPeriod } from '../common/crypto';
import Stripe from 'stripe';
import type { Request } from 'express';

@Controller('billing')
@UseGuards(AuthGuard, OrganizationGuard)
export class BillingController {
  @Get('subscription')
  async subscription(@Req() req: Request & { organizationId?: string }) {
    return prisma.subscription.findUnique({ where: { organizationId: req.organizationId } });
  }

  @Post('checkout')
  async checkout(
    @Req() req: Request & { organizationId?: string },
    @Body() body: { plan: 'STARTER' | 'BUSINESS' | 'PRO' },
  ) {
    const config = loadConfig();
    if (!config.STRIPE_SECRET_KEY) {
      return { url: null, message: 'Stripe is not configured in this environment.' };
    }
    const priceId =
      body.plan === 'STARTER'
        ? config.STRIPE_STARTER_PRICE_ID
        : body.plan === 'BUSINESS'
          ? config.STRIPE_BUSINESS_PRICE_ID
          : config.STRIPE_PRO_PRICE_ID;
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${config.WEB_URL}/dashboard/billing?checkout=success`,
      cancel_url: `${config.WEB_URL}/dashboard/billing?checkout=cancel`,
      metadata: { organizationId: req.organizationId ?? '' },
    });
    return { url: session.url };
  }

  @Post('portal')
  async portal(@Req() req: Request & { organizationId?: string }) {
    const config = loadConfig();
    const sub = await prisma.subscription.findUnique({ where: { organizationId: req.organizationId } });
    if (!config.STRIPE_SECRET_KEY || !sub?.stripeCustomerId) {
      return { url: null };
    }
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    const portal = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${config.WEB_URL}/dashboard/billing`,
    });
    return { url: portal.url };
  }
}

@Controller('usage')
@UseGuards(AuthGuard, OrganizationGuard)
export class UsageController {
  @Get('current')
  async current(@Req() req: Request & { organizationId?: string }) {
    const period = currentPeriod();
    const usage = await prisma.usageRecord.upsert({
      where: { organizationId_period: { organizationId: req.organizationId!, period } },
      update: {},
      create: { organizationId: req.organizationId!, period },
    });
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: req.organizationId },
    });
    return {
      usage: {
        ...usage,
        storageBytes: Number(usage.storageBytes),
      },
      plan: subscription?.plan ?? 'FREE',
      period,
    };
  }
}
