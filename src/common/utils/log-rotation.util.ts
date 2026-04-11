import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { LoggerService } from '../services/logger.service';

/**
 * Utility service for managing log file rotation
 */
@Injectable()
export class LogRotationUtil {
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly maxBackups = 5;
  private readonly logDir = 'src/logs';

  constructor(private readonly logger: LoggerService) {}

  /**
   * Check if log file needs rotation
   */
  private async needsRotation(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size >= this.maxFileSize;
    } catch {
      return false;
    }
  }

  /**
   * Rotate a specific log file
   */
  private async rotateFile(category: string): Promise<void> {
    const basePath = path.join(this.logDir, `${category}.log`);

    // Check if rotation is needed
    if (!(await this.needsRotation(basePath))) {
      return;
    }

    try {
      // Shift existing backup files
      for (let i = this.maxBackups - 1; i >= 0; i--) {
        const oldPath = i === 0 ? basePath : `${basePath}.${i}`;
        const newPath = `${basePath}.${i + 1}`;

        try {
          await fs.access(oldPath);
          if (i === this.maxBackups - 1) {
            await fs.unlink(oldPath); // Remove oldest backup
          } else {
            await fs.rename(oldPath, newPath);
          }
        } catch {
          // File doesn't exist, continue
        }
      }

      // Create new empty log file after moving the old one
      const oldContent = await fs.readFile(basePath, 'utf8');
      await fs.writeFile(`${basePath}.1`, oldContent);
      await fs.writeFile(basePath, '');

      // Log successful rotation
      await this.logger.info('system', `Rotated log file: ${category}`, {
        category,
        maxFileSize: this.maxFileSize,
        maxBackups: this.maxBackups,
      });
    } catch (error) {
      await this.logger.error(
        'system',
        `Failed to rotate log file: ${category}`,
        error,
      );
    }
  }

  /**
   * Check and rotate all log files if needed
   */
  async checkAndRotateAll(): Promise<void> {
    const categories = [
      'error',
      'activity',
      'payment',
      'booking',
      'authentication',
      'proposal',
      'contract',
      'notification',
      'message',
      'availability',
      'review',
      'service',
      'transaction',
      'system',
      'security',
    ];

    for (const category of categories) {
      await this.rotateFile(category);
    }
  }

  /**
   * Schedule periodic log rotation checks
   */
  scheduleRotation(intervalMs: number = 24 * 60 * 60 * 1000): NodeJS.Timeout {
    return setInterval(() => {
      this.checkAndRotateAll().catch(error => {
        this.logger.error(
          'system',
          'Failed to run scheduled log rotation',
          error,
        );
      });
    }, intervalMs);
  }
}
