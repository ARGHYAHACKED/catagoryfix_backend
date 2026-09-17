import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { prisma } from '@catalogfix/database';
import type { AuthUser } from './auth.guard';

@Injectable()
export class OrganizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<
      Request & { user?: AuthUser; organizationId?: string; membershipRole?: string }
    >();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Not allowed.' });
    }
    const organizationId =
      (req.headers['x-organization-id'] as string | undefined) ??
      (req.params.organizationId as string | undefined) ??
      (req.body?.organizationId as string | undefined) ??
      (req.query.organizationId as string | undefined);
    if (!organizationId) {
      throw new ForbiddenException({ code: 'ORGANIZATION_REQUIRED', message: 'Organization is required.' });
    }
    const membership = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: user.id, organizationId } },
    });
    if (!membership) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'You do not belong to this organization.' });
    }
    req.organizationId = organizationId;
    req.membershipRole = membership.role;
    return true;
  }
}
