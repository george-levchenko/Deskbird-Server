import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();
    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(data => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        this.logger.log(`${method} ${url} ${statusCode} - ${Date.now() - now}ms`);
        this.logger.debug(`Response: ${JSON.stringify(data)}`);
      }),
      catchError(error => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        this.logger.error(`Error in ${method} ${url}: ${error.message} (${statusCode}) - ${Date.now() - now}ms`, error.stack);
        throw error;
      })
    );
  }
}
