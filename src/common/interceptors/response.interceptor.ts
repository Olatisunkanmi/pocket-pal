import {
  ApiResponseMetaOptions,
  API_RESPONSE_METADATA,
} from '../decorators/response.decorator';
import { ResponseMessage } from '../../common/interfaces';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector = new Reflector()) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const responseOptions =
      this.reflector.getAllAndOverride<ApiResponseMetaOptions>(
        API_RESPONSE_METADATA,
        [context.getHandler(), context.getClass()],
      );

    const message = responseOptions?.message || ResponseMessage.SUCCESS;
    if (responseOptions?.statusCode) {
      context.switchToHttp().getResponse().status(responseOptions?.statusCode);
    }

    return next.handle().pipe(
      map((data) => {
        if (
          responseOptions?.statusCode >= 300 &&
          responseOptions?.statusCode < 400
        ) {
          return data;
        }

        return {
          statusCode: responseOptions?.statusCode || 200,
          message,
          data,
        };
      }),
    );
  }
}
