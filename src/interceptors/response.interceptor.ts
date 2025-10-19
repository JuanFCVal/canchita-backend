import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  createErrorResponse,
} from '../utils/response.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const traceId =
      (request.headers['x-trace-id'] as string) ||
      `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    response.setHeader('x-trace-id', traceId);

    return next.handle().pipe(
      map((data: any): ApiSuccessResponse => {
        return data;
      }),
      catchError((error: any): Observable<never> => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let errorDetails: string | undefined;

        if (error instanceof HttpException) {
          status = error.getStatus();
          const errorResponse = error.getResponse();

          if (typeof errorResponse === 'string') {
            message = errorResponse;
          } else if (
            typeof errorResponse === 'object' &&
            errorResponse !== null
          ) {
            message = (errorResponse as any).message || error.message;
            errorDetails = (errorResponse as any).error;
          }
        } else if (error instanceof Error) {
          message = error.message;
          errorDetails = error.stack;
        }

        const errorResponse: ApiErrorResponse = createErrorResponse(
          status,
          message,
          traceId,
          errorDetails,
        );

        response.status(status);

        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
}
