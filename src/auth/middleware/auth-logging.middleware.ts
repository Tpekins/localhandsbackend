import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../common/services/logger.service';

/**
 * Middleware to log authentication-related events
 */
@Injectable()
export class AuthLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Process and log authentication requests
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, body } = req;
    const userAgent = req.get('user-agent') || '';

    // Create a response interceptor
    const originalSend = res.send;
    res.send = function (body: any) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log authentication attempt
      if (originalUrl.includes('/auth/')) {
        const isSuccess = statusCode >= 200 && statusCode < 300;
        const event = isSuccess
          ? 'Authentication Success'
          : 'Authentication Failed';

        this.logger.logAuth(event, {
          userId: body?.userId, // Will be present on successful auth
          success: isSuccess,
          method,
          url: originalUrl,
          userAgent,
          responseTime,
          statusCode,
          failureReason: !isSuccess ? body?.message : undefined,
        });

        // Additional security logging for failed attempts
        if (!isSuccess) {
          this.logger.logSecurity('Failed Authentication Attempt', {
            ip: req.ip,
            userAgent,
            method,
            url: originalUrl,
            attemptedCredentials: {
              username: req.body?.username || req.body?.email,
              // Never log passwords
            },
          });
        }
      }

      return originalSend.call(res, body);
    }.bind(this);

    next();
  }
}
