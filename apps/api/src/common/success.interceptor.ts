import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, type Observable } from 'rxjs';

@Injectable()
export class SuccessEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return { success: true, data };
      }),
    );
  }
}
