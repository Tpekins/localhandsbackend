import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from '../../generated/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message =
        typeof errorResponse === 'object' && 'message' in errorResponse
          ? Array.isArray(errorResponse['message'])
            ? errorResponse['message'][0]
            : errorResponse['message']
          : exception.message;

      if (
        typeof errorResponse === 'object' &&
        errorResponse !== null &&
        'errors' in errorResponse
      ) {
        errors = errorResponse['errors'];
        this.logger.error(`Validation errors: ${JSON.stringify(errors)}`);
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma specific errors
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Unique constraint violation';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = `Database error: ${exception.message}`;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorObj: Record<string, any> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    if (errors) {
      errorObj.errors = errors;
    }

    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
      request.headers['user-agent'],
    );

    response.status(status).json(errorObj);
  }
}
