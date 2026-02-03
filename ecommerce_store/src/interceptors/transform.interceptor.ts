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
import { SKIP_TRANSFORM_KEY } from '../decorators/skip-transform.decorator';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  const skipTransform = this.reflector.getAllAndOverride<boolean>(
    SKIP_TRANSFORM_KEY,
    [context.getHandler(), context.getClass()],
  );

  if (skipTransform) {
    return next.handle();
  }

  const customMessage = this.reflector.get<string>(
    RESPONSE_MESSAGE_KEY,
    context.getHandler(),
  );

  return next.handle().pipe(
    map((data) => ({
      status: 'success',
      message: customMessage || 'Operation successful',
      payload: data,
    })),
  );
}

}
