import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuditEvent, prisma } from '@catalogfix/database';
import { AuthGuard, type AuthUser } from '../common/auth.guard';
import { OrganizationGuard } from '../common/organization.guard';
import sanitizeHtml from 'sanitize-html';
import type { Request } from 'express';

@Controller()
@UseGuards(AuthGuard, OrganizationGuard)
export class ProductsController {
  @Get('products/:id')
  async get(@Req() req: Request & { organizationId?: string }, @Param('id') id: string) {
    const product = await prisma.product.findFirst({
      where: { id, import: { organizationId: req.organizationId, deletedAt: null } },
      include: { variants: true, images: true, tags: true, options: { include: { values: true } }, issues: true },
    });
    if (!product) {
      throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: 'Product could not be found.' });
    }
    return {
      ...product,
      descriptionHtml: product.descriptionHtml
        ? sanitizeHtml(product.descriptionHtml, {
            allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th'],
            allowedAttributes: {},
          })
        : product.descriptionHtml,
    };
  }

  @Patch('products/:id')
  async patch(
    @Req() req: Request & { organizationId?: string; user?: AuthUser },
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      vendor?: string;
      productType?: string;
      price?: number;
      sku?: string;
      seoTitle?: string;
      seoDescription?: string;
    },
  ) {
    const existing = await prisma.product.findFirst({
      where: { id, import: { organizationId: req.organizationId } },
    });
    if (!existing) {
      throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: 'Product could not be found.' });
    }
    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        vendor: body.vendor ?? existing.vendor,
        productType: body.productType ?? existing.productType,
        price: body.price ?? existing.price,
        sku: body.sku ?? existing.sku,
        seoTitle: body.seoTitle ?? existing.seoTitle,
        seoDescription: body.seoDescription ?? existing.seoDescription,
      },
    });
    await prisma.auditLog.create({
      data: {
        organizationId: req.organizationId,
        userId: req.user!.id,
        event: AuditEvent.PRODUCT_EDITED,
        metadata: { productId: id },
      },
    });
    return updated;
  }

  @Post('issues/:id/resolve')
  async resolve(
    @Req() req: Request & { organizationId?: string },
    @Param('id') id: string,
    @Body() body: { resolution?: string },
  ) {
    const issue = await prisma.validationIssue.findFirst({
      where: { id, import: { organizationId: req.organizationId } },
    });
    if (!issue) {
      throw new NotFoundException({ code: 'ISSUE_NOT_FOUND', message: 'Issue could not be found.' });
    }
    return prisma.validationIssue.update({
      where: { id },
      data: { resolved: true, resolution: body.resolution ?? 'ignored', resolvedAt: new Date() },
    });
  }
}
