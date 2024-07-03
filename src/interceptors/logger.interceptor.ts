import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { inspect } from 'util';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const req: Request = context.getArgByIndex(1).req;
    const { params, query, body } = req;

    const inspectOptions = {
      showHidden: false,
      depth: null,
      colors: true,
      maxArrayLength: 10,
      maxStringLength: 1000,
    };
    const requestFormat = `Request original url: ${req.originalUrl}\nMethod: ${
      req.method
    }\nIP: ${req.ip}\nUser: ${JSON.stringify(
      req.user,
    )}\nRequest params: ${inspect(
      params,
      inspectOptions,
    )}\nRequest data: ${inspect(query || body, inspectOptions)}\n`;
    // this.logger.log(requestFormat);

    return next.handle().pipe(
      map((data) => {
        const responseFormat = `Response data: ${inspect(
          data,
          inspectOptions,
        )}`;
        // this.logger.log(responseFormat);

        return data;
      }),
    );
  }
}
