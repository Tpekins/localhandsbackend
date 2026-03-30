import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

/**
 * Global interceptor for logging HTTP requests and responses
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Intercept and log HTTP requests/responses
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, user } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log the incoming request
    this.logger.info('activity', `Incoming ${method} ${url}`, {
      method,
      url,
      userId: user?.id,
      userAgent,
      body: this.sanitizeBody(body),
    });

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const responseTime = Date.now() - startTime;

          // Log successful response
          this.logger.info('activity', `${method} ${url} completed`, {
            method,
            url,
            userId: user?.id,
            userAgent,
            responseTime,
            statusCode: context.switchToHttp().getResponse().statusCode,
            responseData: this.sanitizeResponse(data),
          });
        },
        error: error => {
          const responseTime = Date.now() - startTime;

          // Log error response
          this.logger.error('error', `${method} ${url} failed`, {
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
  private sanitizeBody(body: any): any {
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
  private sanitizeResponse(data: any): any {
    if (!data) return data;

    // If data is an array, sanitize each item
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeResponse(item));
    }

    // If data is an object, create a sanitized copy
    if (typeof data === 'object') {
      const sanitized = { ...data };
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
