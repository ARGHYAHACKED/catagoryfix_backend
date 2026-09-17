import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();
    const requestId = request.requestId ?? 'req_unknown';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'string'
          ? payload
          : ((payload as { message?: string | string[] }).message ?? exception.message);
      const code =
        typeof payload === 'object' && payload && 'code' in payload
          ? String((payload as { code: string }).code)
          : 'HTTP_ERROR';
      response.status(status).json({
        success: false,
        error: {
          code,
          message: Array.isArray(message) ? message.join(', ') : message,
          details: typeof payload === 'object' ? payload : null,
        },
        requestId,
      });
      return;
    }

    const error = exception as { code?: string; message?: string; stack?: string };
    console.error('[ApiExceptionFilter Error]', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: error.code ?? 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
        details: null,
      },
      requestId,
    });
  }
}
