import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the response is already conforming to the custom structure, use its properties.
        const isConforming =
          res &&
          typeof res === 'object' &&
          'success' in res &&
          ('data' in res || 'message' in res);

        if (isConforming) {
          return {
            success: res.success !== undefined ? res.success : true,
            message: res.message || 'Success',
            data: res.data !== undefined ? res.data : null,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          message: 'Success',
          data: res === undefined ? null : res,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
