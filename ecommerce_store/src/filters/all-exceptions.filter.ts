import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        
        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          errorDetails = responseObj.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiResponse = {
      status: 'error',
      message,
      error: errorDetails ? { details: errorDetails } : undefined,
    };

    response.status(status).json(errorResponse);
  }
}