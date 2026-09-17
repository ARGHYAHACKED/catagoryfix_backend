import { Controller, Headers, Post, Req, UnauthorizedException } from '@nestjs/common';
import { loadConfig } from '@catalogfix/config';
import { prisma, Plan, SubscriptionStatus } from '@catalogfix/database';
import Stripe from 'stripe';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

function unixSecondsToDate(value: number | undefined): Date | undefined {
  return typeof value === 'number' ? new Date(value * 1000) : undefined;
}

@Controller('webhooks')
export class WebhooksController {
  @Post('stripe')
  async stripe(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const config = loadConfig();
    if (!config.STRIPE_WEBHOOK_SECRET || !config.STRIPE_SECRET_KEY) {
      throw new UnauthorizedException({ code: 'STRIPE_NOT_CONFIGURED', message: 'Stripe is not configured.' });
    }
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(req.rawBody ?? Buffer.from(''), signature, config.STRIPE_WEBHOOK_SECRET);
    const existing = await prisma.webhookEvent.findUnique({
      where: { provider_providerEventId: { provider: 'stripe', providerEventId: event.id } },
    });
    if (existing?.processedAt) {
      return { received: true, duplicate: true };
    }
    await prisma.webhookEvent.upsert({
      where: { provider_providerEventId: { provider: 'stripe', providerEventId: event.id } },
      update: {},
      create: { provider: 'stripe', providerEventId: event.id, type: event.type },
    });

    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const organizationId = subscription.metadata.organizationId;
      if (organizationId) {
        const priceId = subscription.items.data[0]?.price.id;
        const plan =
          priceId === config.STRIPE_PRO_PRICE_ID
            ? Plan.PRO
            : priceId === config.STRIPE_BUSINESS_PRICE_ID
              ? Plan.BUSINESS
              : priceId === config.STRIPE_STARTER_PRICE_ID
                ? Plan.STARTER
                : Plan.FREE;
        const status =
          subscription.status === 'active'
            ? SubscriptionStatus.ACTIVE
            : subscription.status === 'past_due'
              ? SubscriptionStatus.PAST_DUE
              : subscription.status === 'canceled'
                ? SubscriptionStatus.CANCELLED
                : SubscriptionStatus.TRIALING;
        await prisma.subscription.update({
          where: { organizationId },
          data: {
            plan: event.type === 'customer.subscription.deleted' ? Plan.FREE : plan,
            status: event.type === 'customer.subscription.deleted' ? SubscriptionStatus.CANCELLED : status,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: String(subscription.customer),
            stripePriceId: priceId,
            currentPeriodStart: unixSecondsToDate(
              (subscription as Stripe.Subscription & { current_period_start?: number }).current_period_start,
            ),
            currentPeriodEnd: unixSecondsToDate(
              (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end,
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
      }
    }

    await prisma.webhookEvent.update({
      where: { provider_providerEventId: { provider: 'stripe', providerEventId: event.id } },
      data: { processedAt: new Date() },
    });
    return { received: true };
  }
}
