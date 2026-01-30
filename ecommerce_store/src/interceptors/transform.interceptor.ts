import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // Get custom message from decorator if available
    const customMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        // If data is already in our ApiResponse format, return as is
        if (data && typeof data === 'object' && 'status' in data && 'message' in data) {
          return data as ApiResponse<T>;
        }

        // Default success response
        return {
          status: 'success',
          message: customMessage || 'Operation successful',
          payload: data,
        };
      }),
    );
  }
}