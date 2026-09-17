import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request & { requestId?: string }, res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string | undefined) ?? `req_${randomUUID()}`;
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  }
}
