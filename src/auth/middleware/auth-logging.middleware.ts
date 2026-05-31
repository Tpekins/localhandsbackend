import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../common/services/logger.service';

interface AuthResponseBody {
  userId?: string;
  message?: string;
}

interface AuthRequestBody {
  username?: string;
  email?: string;
}

/**
 * Middleware to log authentication-related events
 */
@Injectable()
export class AuthLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Process and log authentication requests
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // Create a response interceptor
    const originalSend = res.send.bind(res) as unknown as (
      body?: unknown,
    ) => Response;
    res.send = (body?: unknown): Response => {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      const responseBody = body as AuthResponseBody | undefined;

      // Log authentication attempt
      if (originalUrl.includes('/auth/')) {
        const isSuccess = statusCode >= 200 && statusCode < 300;
        const event = isSuccess
          ? 'Authentication Success'
          : 'Authentication Failed';

        void this.logger.logAuth(responseBody?.userId, event, isSuccess, {
          method,
          url: originalUrl,
          userAgent,
          responseTime,
          statusCode,
          failureReason: !isSuccess ? responseBody?.message : undefined,
        });

        // Additional security logging for failed attempts
        if (!isSuccess) {
          const requestBody = req.body as AuthRequestBody;
          void this.logger.logSecurity('Failed Authentication Attempt', {
            ip: req.ip,
            userAgent,
            method,
            url: originalUrl,
            attemptedCredentials: {
              username: requestBody?.username || requestBody?.email,
              // Never log passwords
            },
          });
        }
      }

      return originalSend(body);
    };

    next();
  }
}
