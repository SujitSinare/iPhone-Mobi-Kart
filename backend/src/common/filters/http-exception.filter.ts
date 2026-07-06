import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal Server Error';
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      const resObj = exception.getResponse();
      message = exception.message;

      if (typeof resObj === 'object' && resObj !== null) {
        const responseMessage = (resObj as any).message;
        if (Array.isArray(responseMessage)) {
          // This handles validation errors thrown by the ValidationPipe
          message = 'Validation Failed';
          errors = responseMessage;
        } else if (typeof responseMessage === 'string') {
          message = responseMessage;
          errors = [responseMessage];
        } else {
          errors = [message];
        }
      } else if (typeof resObj === 'string') {
        message = resObj;
        errors = [resObj];
      }
    } else {
      // General program errors
      message = exception.message || 'Internal Server Error';
      errors = [message];

      // Log unhandled exceptions
      this.logger.error(
        `Unhandled Exception: ${message} - Path: ${request.url}`,
        exception.stack
      );
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
