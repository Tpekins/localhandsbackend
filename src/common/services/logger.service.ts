import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Service responsible for handling all logging operations
 */
@Injectable()
export class LoggerService implements OnModuleInit {
  private readonly logDir = 'src/logs';
  private readonly loggers: Map<string, Logger> = new Map();

  /**
   * Initialize logging system when module starts
   */
  async onModuleInit() {
    await this.initializeLogDirectory();
  }

  /**
   * Initialize log directory and files
   * @private
   */
  private async initializeLogDirectory() {
    try {
      // Create logs directory if it doesn't exist
      await fs.mkdir(this.logDir, { recursive: true });

      // Initialize all log files
      const logFiles = [
        'error.log',
        'activity.log',
        'payment.log',
        'booking.log',
        'authentication.log',
        'proposal.log',
        'contract.log',
        'notification.log',
        'message.log',
        'availability.log',
        'review.log',
        'service.log',
        'transaction.log',
        'system.log',
        'security.log',
      ];

      for (const file of logFiles) {
        const filePath = path.join(this.logDir, file);
        try {
          await fs.access(filePath);
        } catch {
          await fs.writeFile(filePath, ''); // Create if doesn't exist
        }
      }
    } catch (error) {
      console.error('Failed to initialize log directory:', error);
    }
  }

  /**
   * Get or create a logger for a specific category
   * @private
   */
  private getLogger(category: string): Logger {
    if (!this.loggers.has(category)) {
      this.loggers.set(category, new Logger(category));
    }
    return this.loggers.get(category);
  }

  /**
   * Write log entry to appropriate file
   * @private
   */
  private async writeToFile(
    category: string,
    level: string,
    message: string,
    data?: any,
  ) {
    const timestamp = new Date().toISOString();
    const logEntry =
      JSON.stringify(
        {
          timestamp,
          level,
          message,
          data,
        },
        null,
        2,
      ) + '\n';

    try {
      await fs.appendFile(path.join(this.logDir, `${category}.log`), logEntry);
    } catch (error) {
      console.error(`Failed to write to ${category}.log:`, error);
    }
  }

  /**
   * Log error messages
   */
  async error(category: string, message: string, error?: Error | any) {
    const logger = this.getLogger(category);
    logger.error(message, error?.stack);
    await this.writeToFile(category, 'error', message, {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });
  }

  /**
   * Log warning messages
   */
  async warn(category: string, message: string, data?: any) {
    const logger = this.getLogger(category);
    logger.warn(message);
    await this.writeToFile(category, 'warn', message, data);
  }

  /**
   * Log informational messages
   */
  async info(category: string, message: string, data?: any) {
    const logger = this.getLogger(category);
    logger.log(message);
    await this.writeToFile(category, 'info', message, data);
  }

  /**
   * Log debug messages
   */
  async debug(category: string, message: string, data?: any) {
    const logger = this.getLogger(category);
    logger.debug(message);
    await this.writeToFile(category, 'debug', message, data);
  }

  /**
   * Log user activity
   */
  async logActivity(userId: string, action: string, details?: any) {
    await this.info('activity', action, { userId, ...details });
  }

  /**
   * Log authentication events
   */
  async logAuth(
    userId: string | undefined,
    event: string,
    success: boolean,
    details?: any,
  ) {
    await this.info('authentication', event, { userId, success, ...details });
  }

  /**
   * Log security events
   */
  async logSecurity(event: string, details?: any) {
    await this.info('security', event, details);
  }

  /**
   * Log payment-related events
   */
  async logPayment(
    userId: string,
    event: string,
    amount: number,
    details?: any,
  ) {
    await this.info('payment', event, { userId, amount, ...details });
  }
}
