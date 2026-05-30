import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

interface RequestUser {
  id?: number;
}

/**
 * Global interceptor for logging HTTP requests and responses
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Intercept and log HTTP requests/responses
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const body = req.body as Record<string, unknown> | undefined;
    const user = (req as Request & { user?: RequestUser }).user;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log the incoming request
    void this.logger.info('activity', `Incoming ${method} ${url}`, {
      method,
      url,
      userId: user?.id,
      userAgent,
      body: this.sanitizeBody(body),
    });

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const responseTime = Date.now() - startTime;

          // Log successful response
          void this.logger.info('activity', `${method} ${url} completed`, {
            method,
            url,
            userId: user?.id,
            userAgent,
            responseTime,
            statusCode: context.switchToHttp().getResponse<Response>()
              .statusCode,
            responseData: this.sanitizeResponse(data),
          });
        },
        error: (error: Error) => {
          const responseTime = Date.now() - startTime;

          // Log error response
          void this.logger.error('error', `${method} ${url} failed`, {
            method,
            url,
            userId: user?.id,
            userAgent,
            responseTime,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          });
        },
      }),
    );
  }

  /**
   * Remove sensitive information from request body
   * @private
   */
  private sanitizeBody(
    body: Record<string, unknown> | undefined,
  ): Record<string, unknown> | undefined {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'creditCard'];

    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Remove sensitive information from response data
   * @private
   */
  private sanitizeResponse(data: unknown): unknown {
    if (!data) return data;

    // If data is an array, sanitize each item
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeResponse(item));
    }

    // If data is an object, create a sanitized copy
    if (typeof data === 'object') {
      const sanitized = { ...(data as Record<string, unknown>) };
      const sensitiveFields = ['password', 'token', 'creditCard'];

      sensitiveFields.forEach(field => {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]';
        }
      });

      return sanitized;
    }

    return data;
  }
}
